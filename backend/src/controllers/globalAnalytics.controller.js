import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * GET /analytics/global/summary
 * admin-only
 */
export const getGlobalSummary = async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalProducts = await prisma.product.count();
    const totalReviews = await prisma.review.count();
    const totalAssignments = await prisma.assignment.count();

    // sentiment counts across all reviews
    const all = await prisma.review.findMany({ select: { sentiment: true } });
    const sentiment = { positive: 0, negative: 0, neutral: 0 };
    all.forEach((r) => {
      const s = (r.sentiment || "NEUTRAL").toUpperCase();
      if (s === "POSITIVE") sentiment.positive++;
      else if (s === "NEGATIVE") sentiment.negative++;
      else sentiment.neutral++;
    });

    res.json({
      totalUsers,
      totalProducts,
      totalReviews,
      totalAssignments,
      sentiment,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * GET /analytics/global/categories
 * returns category-wise counts and sentiment breakdown
 */
export const getCategoryAnalytics = async (req, res) => {
  try {
    // get products grouped by category with their reviews
    const products = await prisma.product.findMany({
      include: { reviews: true },
    });

    const map = {}; // category -> {totalReviews, positive, negative, neutral}
    products.forEach((p) => {
      const cat = p.category || "Uncategorized";
      map[cat] = map[cat] || {
        totalReviews: 0,
        positive: 0,
        negative: 0,
        neutral: 0,
      };
      p.reviews.forEach((r) => {
        map[cat].totalReviews++;
        const s = (r.sentiment || "NEUTRAL").toUpperCase();
        if (s === "POSITIVE") map[cat].positive++;
        else if (s === "NEGATIVE") map[cat].negative++;
        else map[cat].neutral++;
      });
    });

    // format result
    const result = Object.keys(map).map((cat) => ({
      category: cat,
      ...map[cat],
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * GET /analytics/global/top-products?limit=5
 * returns top and bottom products by avg rating
 */
export const getTopProducts = async (req, res) => {
  try {
    const limit = Number(req.query.limit || 5);

    // compute avg ratings for each product
    const products = await prisma.product.findMany({
      include: { reviews: true },
    });

    const arr = products.map((p) => {
      const total = p.reviews.length;
      const avg = total
        ? p.reviews.reduce((a, b) => a + b.rating, 0) / total
        : 0;
      return {
        id: p.id,
        name: p.name,
        category: p.category,
        avgRating: Number(avg.toFixed(2)),
        totalReviews: total,
      };
    });

    const top = arr
      .slice()
      .sort((a, b) => b.avgRating - a.avgRating)
      .slice(0, limit);
    const bottom = arr
      .slice()
      .sort((a, b) => a.avgRating - b.avgRating)
      .slice(0, limit);

    res.json({ top, bottom });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * GET /analytics/global/trend?days=30&group=day
 * returns timeline of review counts (and optionally avg rating) over last N days
 * group = day | week | month
 */
export const getReviewTrend = async (req, res) => {
  try {
    const days = Number(req.query.days || 30);
    const group = req.query.group || "day"; // not strict

    // get date threshold
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - days);

    // fetch reviews in range
    const reviews = await prisma.review.findMany({
      where: { createdAt: { gte: start } },
      select: { id: true, createdAt: true, rating: true },
    });

    // bucket by day/week/month
    const buckets = {};
    reviews.forEach((r) => {
      const d = new Date(r.createdAt);
      let key;
      if (group === "month")
        key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      else if (group === "week") {
        // ISO week: approximate by yyyy-ww using simple approach
        const onejan = new Date(d.getFullYear(), 0, 1);
        const week = Math.ceil(
          ((d - onejan) / 86400000 + onejan.getDay() + 1) / 7
        );
        key = `${d.getFullYear()}-W${String(week).padStart(2, "0")}`;
      } else {
        // day
        key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(d.getDate()).padStart(2, "0")}`;
      }
      buckets[key] = buckets[key] || { count: 0, ratingSum: 0 };
      buckets[key].count++;
      buckets[key].ratingSum += r.rating || 0;
    });

    // convert to sorted arrays (ascending by date key)
    const keys = Object.keys(buckets).sort();
    const labels = keys;
    const counts = keys.map((k) => buckets[k].count);
    const avgRatings = keys.map((k) =>
      buckets[k].count
        ? Number((buckets[k].ratingSum / buckets[k].count).toFixed(2))
        : 0
    );

    res.json({ labels, counts, avgRatings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
