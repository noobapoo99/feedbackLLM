import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const assignProduct = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const assignment = await prisma.assignment.create({
      data: {
        userId,
        productId,
      },
    });

    res.json({ message: "Product assigned", assignment });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getAssignedProducts = async (req, res) => {
  const userId = req.user.id;

  const assignments = await prisma.assignment.findMany({
    where: { userId },
    include: {
      product: {
        include: {
          reviews: true,
        },
      },
    },
  });

  const formatted = assignments.map((a) => ({
    id: a.product.id,
    name: a.product.name,
    category: a.product.category,
    totalReviews: a.product.reviews.length,
  }));

  res.json(formatted);
};

export const getAssignedUsers = async (req, res) => {
  const { productId } = req.params;

  const assignments = await prisma.assignment.findMany({
    where: { productId },
    include: { user: true },
  });

  res.json(assignments.map((a) => a.user));
};
