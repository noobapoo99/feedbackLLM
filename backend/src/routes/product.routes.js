import express from "express";
import {
  createProduct,
  getProducts,
  getProductDetails,
  getProductsByCategory,
} from "../controllers/product.controller.js";
import { verifyToken } from "../middleware/auth.js";
import { verifyRole } from "../middleware/role.js";

const router = express.Router();

// ADMIN ONLY
router.post("/", verifyToken, verifyRole("ADMIN"), createProduct);

// ANY LOGGED USER
router.get("/", verifyToken, getProducts);
router.get("/:productId", verifyToken, getProductDetails);
router.get("/category", verifyToken, getProductsByCategory);
export default router;
