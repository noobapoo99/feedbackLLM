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
