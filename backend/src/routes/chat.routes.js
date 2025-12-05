import express from "express";
import { chatQuery } from "../controllers/chat.controller.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/query", verifyToken, chatQuery);

export default router;
