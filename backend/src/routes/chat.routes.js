import express from "express";
import {
  archiveChat,
  chatMessages,
  createChat,
  getAllChats,
  getChatMessages,
  sendMessage,
} from "../controllers/chat.controller.js";
import { verifyToken } from "../middleware/auth.js";
import { get } from "svelte/store";

const router = express.Router();

//router.post("/query", verifyToken, chatQuery);

router.post("/", verifyToken, createChat);
router.get("/", verifyToken, getAllChats);

router.get("/:chatId/messages", verifyToken, getChatMessages);
router.post("/:chatId/messages", verifyToken, chatMessages);
router.post("/:chatId/messages/new", verifyToken, sendMessage);

router.patch("/:chatId/archives", verifyToken, archiveChat);

export default router;
