import { PrismaClient } from "@prisma/client";
import fetch from "node-fetch";

export const prisma = new PrismaClient();

export async function startAssistantStream(io, socket, chatId, context) {
  const assistantMsg = await prisma.chatMessage.create({
    data: {
      chatId,
      sender: "assistant",
      message: "",
    },
  });

  const msgId = assistantMsg.id;

  socket.emit("assistant:start", { id: msgId });

  const response = await fetch("http://localhost:8000/chat-stream", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(context),
  });

  for await (const chunk of response.body) {
    const text = chunk.toString("utf-8");

    socket.emit("assistant:token", {
      id: msgId,
      chunk: text, // ⚠️ MUST forward raw chunk
    });
  }

  socket.emit("assistant:done", { id: msgId });
}
