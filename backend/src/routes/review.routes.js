import express from "express";
import {
  addReview,
  getMyReviews,
  getReviews,
} from "../controllers/review.controller.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// only logged in users can add review
router.post("/", verifyToken, addReview);

// any logged in user can see reviews
router.get("/my-reviews", verifyToken, getMyReviews);
router.get("/:productId", verifyToken, getReviews);

export default router;
