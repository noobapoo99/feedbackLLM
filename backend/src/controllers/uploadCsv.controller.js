import fs from "fs";
import csv from "csv-parser";
import axios from "axios";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const uploadCsv = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No CSV uploaded" });

  const { productId } = req.body;
  if (!productId)
    return res.status(400).json({ error: "productId is required" });

  const filePath = req.file.path;
  let imported = 0;
  let skipped = 0;

  try {
    const stream = fs.createReadStream(filePath).pipe(csv());

    stream.on("data", async (row) => {
      stream.pause();

      try {
        if (!row["Review Text"]?.trim()) {
          stream.resume();
          return;
        }

        const reviewerName =
          row["Reviewer Name"] || row["Reviewer"] || "Anonymous Reviewer";

        // --- SAFE RATING PARSE ---
        const rawRating = row["Rating"] || "";
        const ratingMatch = rawRating.match(/\d+/);
        const rating = ratingMatch ? parseInt(ratingMatch[0]) : 0;

        // --- CHECK DUPLICATE ---
        const existing = await prisma.review.findFirst({
          where: {
            productId,
            content: row["Review Text"],
          },
        });

        if (existing) {
          skipped++;
          stream.resume();
          return;
        }

        // --- NLP ANALYSIS ---
        let sentiment = "neutral";
        let sentimentScore = 0;

        try {
          const sentimentRes = await axios.post(
            "${process.env.LLM_API_URL}/analyze",
            { text: row["Review Text"] }
          );

          sentiment = sentimentRes.data.sentiment || "neutral";
          sentimentScore = parseFloat(sentimentRes.data.score) || 0;
        } catch (err) {
          console.log("Sentiment API failed → using defaults");
        }

        // --- SAVE REVIEW ---
        await prisma.review.create({
          data: {
            content: row["Review Text"],
            reviewerName,
            rating,
            sentiment,
            sentimentScore, // <-- FLOAT NOW
            productId,
            userId: null,
          },
        });

        imported++;
      } catch (err) {
        console.error("Row error:", err);
      }

      stream.resume();
    });

    stream.on("end", () => {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

      return res.json({
        message: "CSV Import Complete",
        imported,
        skipped,
      });
    });

    stream.on("error", (err) => {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

      return res.status(500).json({
        error: "CSV parsing failed",
        details: err.message,
      });
    });
  } catch (outerErr) {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    console.error("Upload failed:", outerErr);
    return res.status(500).json({ error: "Server error" });
  }
};
