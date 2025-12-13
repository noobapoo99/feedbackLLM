import axios from "axios";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const chatQuery = async (req, res) => {
  const userId = req.user.id;
  const userMessage = req.body.message;

  // 1. Store user message
  await prisma.chatMessage.create({
    data: { userId, message: userMessage, sender: "user" },
  });

  // 2. Send message to Python LLM (intent detection)
  const llm = await axios.post("http://localhost:8000/chat-intent", {
    query: userMessage,
  });

  const intent = llm.data.intent;
  const product = llm.data.product;
  const chart = llm.data.chart;

  let response = "";
  let data = [];

  // 3. Handle based on detected intent

  if (intent === "nps") {
    // Calculate NPS
    const reviews = await prisma.review.findMany({
      where: { productId: product.id },
    });

    const promoters = reviews.filter((r) => r.rating >= 4).length;
    const detractors = reviews.filter((r) => r.rating <= 2).length;

    const nps = ((promoters - detractors) / reviews.length) * 100;

    response = `The NPS for ${product.name} is ${nps.toFixed(2)}%.`;

    data = [
      { label: "Promoters", value: promoters },
      { label: "Detractors", value: detractors },
    ];
  } else if (intent === "sentiment_breakdown") {
    const reviews = await prisma.review.groupBy({
      by: ["sentiment"],
      _count: true,
    });

    response = "Here is the sentiment breakdown.";

    data = reviews.map((r) => ({
      label: r.sentiment,
      value: r._count,
    }));
  } else if (intent === "rating_trend") {
    const reviews = await prisma.review.findMany({
      where: { productId: product.id },
      orderBy: { createdAt: "asc" },
    });

    response = `Rating trend for ${product.name}.`;

    data = reviews.map((r) => ({
      date: r.createdAt,
      rating: r.rating,
    }));
  } else {
    response = "Sorry, I could not understand your question.";
  }

  // 4. Save system response
  await prisma.chatMessage.create({
    data: {
      userId,
      message: response,
      sender: "system",
    },
  });

  // 5. Return to UI
  res.json({
    response,
    data,
    chartType: chart,
  });
};
export const createChat = async (req, res) => {
  const { title } = req.body;

  try {
    const newChat = await prisma.chat.create({
      data: {
        title,
        userId: req.user.id,
      },
    });

    res.status(201).json(newChat);
  } catch (error) {
    res.status(500).json({ error: "Failed to create chat." });
    console.error("create chat error:", error);
  }
};
export const getAllChats = async (req, res) => {
  try {
    const chats = await prisma.chat.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
    });

    res.json(chats);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve chats." });
    console.error("get all chats error:", error);
  }
};

export const getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;

    if (!chatId) {
      return res.status(400).json({ error: "chatId missing" });
    }

    const messages = await prisma.chatMessage.findMany({
      where: {
        chatId: chatId, // ✅ must be string
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    res.json(messages);
  } catch (err) {
    console.error("getChatMessages error:", err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

export const chatMessages = async (req, res) => {
  const chatId = parseInt(req.params.chatId);

  try {
    const messages = await prisma.chatMessage.findMany({
      where: { chatId, userId: req.user.id },
      orderBy: { createdAt: "asc" },
    });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve chat messages." });
    console.error("get chat messages error:", error);
  }
};
export const archiveChat = async (req, res) => {
  const chatId = req.params.chatId;
  try {
    await prisma.chat.update({
      where: { id: parseInt(chatId) },
      data: { archived: true },
    });
    res.json({ message: "Chat archived successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to archive chat." });
    console.error("archive chat error:", error);
  }
};
export const sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { message, sender } = req.body;

    const newMessage = await prisma.chatMessage.create({
      data: {
        chatId,
        sender,
        message,
      },
    });

    res.json(newMessage);
  } catch (err) {
    console.error("sendMessage error:", err);
    res.status(500).json({ error: "Failed to send message" });
  }
};
