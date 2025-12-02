import { PrismaClient } from "@prisma/client";
import { analyzeSentiment } from "../utils/analyze.js";
const prisma = new PrismaClient();

// create review
export const addReview = async (req, res) => {
  try {
    const { productId, rating, content } = req.body;

    const analysis = await analyzeSentiment(content);

    const review = await prisma.review.create({
      data: {
        productId,
        rating,
        content,
        userId: req.user.id,
        sentiment: analysis.label,
        sentimentScore: analysis.score,
      },
    });

    res.json({ message: "Review added", review });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// get reviews for product
export const getReviews = async (req, res) => {
  const { productId } = req.params;

  const reviews = await prisma.review.findMany({
    where: { productId },
    include: { user: true },
  });

  res.json(reviews);
};
