import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getAllUsers = async (req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  res.json(users);
};
export const getAllProducts = async (req, res) => {
  const products = await prisma.product.findMany({
    include: {
      reviews: true,
      assignments: true,
    },
  });

  const formatted = products.map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    totalReviews: p.reviews.length,
    assignedTo: p.assignments.length,
  }));

  res.json(formatted);
};
export const getAllAssignments = async (req, res) => {
  const assignments = await prisma.assignment.findMany({
    include: {
      user: true,
      product: true,
    },
  });

  const response = assignments.map((a) => ({
    id: a.id,
    user: a.user.name,
    email: a.user.email,
    product: a.product.name,
    category: a.product.category,
  }));

  res.json(response);
};
export const getAdminSummary = async (req, res) => {
  const users = await prisma.user.count();
  const products = await prisma.product.count();
  const reviews = await prisma.review.count();
  const assignments = await prisma.assignment.count();

  res.json({
    users,
    products,
    reviews,
    assignments,
  });
};
