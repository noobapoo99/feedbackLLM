import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { verifyRole } from "../middleware/role.js";
import {
  getGlobalSummary,
  getCategoryAnalytics,
  getTopProducts,
  getReviewTrend,
} from "../controllers/globalAnalytics.controller.js";

const router = express.Router();

router.get("/summary", verifyToken, verifyRole("ADMIN"), getGlobalSummary);
router.get(
  "/categories",
  verifyToken,
  verifyRole("ADMIN"),
  getCategoryAnalytics
);
router.get("/top-products", verifyToken, verifyRole("ADMIN"), getTopProducts);
router.get("/trend", verifyToken, verifyRole("ADMIN"), getReviewTrend);

export default router;
