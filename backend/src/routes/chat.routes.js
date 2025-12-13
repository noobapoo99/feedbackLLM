import express from "express";
import {
  archiveChat,
  chatMessages,
  createChat,
  getAllChats,
  getChatMessages,
} from "../controllers/chat.controller.js";
import { verifyToken } from "../middleware/auth.js";
import { get } from "svelte/store";

const router = express.Router();

//router.post("/query", verifyToken, chatQuery);

router.post("/", verifyToken, createChat);
router.get("/", verifyToken, getAllChats);
router.post("/:chatId/messages", verifyToken, getChatMessages);
router.get("/:chatId/messages", verifyToken, chatMessages);
router.patch("/:chatId/archives", verifyToken, archiveChat);

export default router;
