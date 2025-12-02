import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// create review
export const addReview = async (req, res) => {
  try {
    const { productId, rating, content } = req.body;

    const review = await prisma.review.create({
      data: {
        productId,
        rating,
        content,
        userId: req.user.id, // from JWT middleware
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
