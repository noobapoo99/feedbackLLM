import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { verifyRole } from "../middleware/role.js";
import {
  getProductAnalytics,
  getGlobalAnalytics,
  getRatingDistribution,
} from "../controllers/analytics.controller.js";

const router = express.Router();

router.get("/summary", verifyToken, verifyRole("ADMIN"), getGlobalAnalytics);
router.get("/product/:productId", verifyToken, getProductAnalytics);
router.get("/product/:productId/ratings", verifyToken, getRatingDistribution);

export default router;
