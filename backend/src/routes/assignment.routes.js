import express from "express";
import {
  assignProduct,
  getAssignedProducts,
  getAssignedUsers,
} from "../controllers/assignment.controller.js";
import { verifyToken } from "../middleware/auth.js";
import { verifyRole } from "../middleware/role.js";

const router = express.Router();

// Admin assigns
router.post("/", verifyToken, verifyRole("ADMIN"), assignProduct);

// Analyst sees assigned products
router.get("/me", verifyToken, getAssignedProducts);

// Admin gets users for a product
router.get("/:productId", verifyToken, verifyRole("ADMIN"), getAssignedUsers);

export default router;
