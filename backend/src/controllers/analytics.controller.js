import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getProductAnalytics = async (req, res) => {
  const { productId } = req.params;

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      reviews: true,
    },
  });

  if (!product) return res.status(404).json({ error: "Product not found" });

  const reviews = product.reviews;

  const total = reviews.length;
  const avgRating = total
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / total
    : 0;

  const positive = reviews.filter((r) => r.sentiment === "POSITIVE").length;
  const negative = reviews.filter((r) => r.sentiment === "NEGATIVE").length;
  const neutral = reviews.filter((r) => r.sentiment === "NEUTRAL").length;

  const stats = {
    productId,
    productName: product.name,
    totalReviews: total,
    avgRating: Number(avgRating.toFixed(2)),
    sentimentBreakdown: {
      positive,
      negative,
      neutral,
    },
  };

  res.json(stats);
};
export const getGlobalAnalytics = async (req, res) => {
  const totalProducts = await prisma.product.count();
  const totalUsers = await prisma.user.count();
  const totalReviews = await prisma.review.count();

  const reviews = await prisma.review.findMany();

  const positive = reviews.filter((r) => r.sentiment === "POSITIVE").length;
  const negative = reviews.filter((r) => r.sentiment === "NEGATIVE").length;
  const neutral = reviews.filter((r) => r.sentiment === "NEUTRAL").length;

  res.json({
    totalUsers,
    totalProducts,
    totalReviews,
    sentiment: {
      positive,
      negative,
      neutral,
    },
  });
};
export const getRatingDistribution = async (req, res) => {
  const { productId } = req.params;

  const reviews = await prisma.review.findMany({
    where: { productId },
  });

  const dist = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };

  reviews.forEach((r) => {
    dist[r.rating]++;
  });

  res.json(dist);
};
