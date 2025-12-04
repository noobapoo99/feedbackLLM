import fs from "fs";
import csv from "csv-parser";
import axios from "axios";
import pLimit from "p-limit";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const limit = pLimit(5); // Limit Python NLP concurrency

export const uploadCsv = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No CSV uploaded" });

  const { productId } = req.body;
  if (!productId)
    return res.status(400).json({ error: "productId is required" });

  const filePath = req.file.path;
  let imported = 0;
  let skipped = 0;

  const stream = fs
    .createReadStream(filePath)
    .pipe(csv())
    .on("data", async (row) => {
      stream.pause();

      try {
        const email =
          (row["Reviewer Name"] || "user").toLowerCase().replace(/\s+/g, "") +
          "@import.com";

        const user = await prisma.user.upsert({
          where: { email },
          update: {},
          create: {
            name: row["Reviewer Name"] || "Unknown User",
            email,
            password: "placeholder",
            role: "ANALYST",
          },
        });

        const existing = await prisma.review.findFirst({
          where: {
            userId: user.id,
            productId,
            content: row["Review Text"],
          },
        });

        if (existing) {
          skipped++;
          stream.resume();
          return;
        }

        const sentimentRes = await axios.post("http://localhost:8000/analyze", {
          text: row["Review Text"],
        });

        await prisma.review.create({
          data: {
            content: row["Review Text"],
            rating: parseInt(row["Rating"].replace(/\D+/g, "")) || 0,
            sentiment: sentimentRes.data.sentiment,
            sentimentScore: sentimentRes.data.score,
            userId: user.id,
            productId,
          },
        });

        imported++;
      } catch (err) {
        console.error("Error importing row:", err);
      }

      stream.resume();
    })
    .on("end", () => {
      fs.unlinkSync(filePath);
      res.json({
        message: "CSV Import Complete",
        imported,
        skipped,
      });
    })
    .on("error", (err) => {
      res.status(500).json({ error: "CSV parsing error", details: err });
    });
};
