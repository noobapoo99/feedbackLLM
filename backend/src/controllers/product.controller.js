import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createProduct = async (req, res) => {
  try {
    const { name, category } = req.body;

    const product = await prisma.product.create({
      data: { name, category },
    });

    res.json({ message: "Product created", product });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getProducts = async (req, res) => {
  const products = await prisma.product.findMany();
  res.json(products);
};
export const getProductDetails = async (req, res) => {
  const { productId } = req.params;

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      reviews: {
        include: { user: true },
      },
    },
  });

  return res.json(product);
};
export const getProductsByCategory = async (req, res) => {
  const { category } = req.query;

  const products = await prisma.product.findMany({
    where: { category },
  });

  res.json(products);
};
