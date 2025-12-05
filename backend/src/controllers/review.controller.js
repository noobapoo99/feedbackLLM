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

export const getMyReviews = async (req, res) => {
  try {
    const userId = req.user.id; // From JWT middleware

    // 1. Find products assigned to this user
    const assignments = await prisma.assignment.findMany({
      where: { userId },
      select: { productId: true },
    });

    if (assignments.length === 0) {
      return res.json([]); // No assigned products → no reviews
    }

    const productIds = assignments.map((a) => a.productId);

    // 2. Fetch reviews for those productIds
    const reviews = await prisma.review.findMany({
      where: { productId: { in: productIds } },
      include: {
        product: true, // include product info
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(reviews);
  } catch (err) {
    console.error("Error fetching user reviews:", err);
    res.status(500).json({ error: "Server error fetching reviews" });
  }
};
