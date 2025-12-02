import express from "express";
import {
  getAllUsers,
  getAllProducts,
  getAllAssignments,
  getAdminSummary,
} from "../controllers/admin.controller.js";
import { verifyToken } from "../middleware/auth.js";
import { verifyRole } from "../middleware/role.js";

const router = express.Router();

router.get("/users", verifyToken, verifyRole("ADMIN"), getAllUsers);
router.get("/products", verifyToken, verifyRole("ADMIN"), getAllProducts);
router.get("/assignments", verifyToken, verifyRole("ADMIN"), getAllAssignments);
router.get("/summary", verifyToken, verifyRole("ADMIN"), getAdminSummary);

export default router;
