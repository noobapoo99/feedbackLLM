import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();
import fetch from "node-fetch";

export async function startAssistantStream(io, socket, chatId) {
  console.log("🤖 AI streaming started…");

  const assistantMsg = await prisma.chatMessage.create({
    data: {
      chatId,
      sender: "assistant",
      message: "",
    },
  });

  const msgId = assistantMsg.id;
  let full = "";

  socket.emit("assistant:start", { id: msgId });

  // 🔥 Call Python streaming API
  const response = await fetch("http://localhost:8000/chat-stream", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: "Generate analysis for this chat", // will be dynamic later
    }),
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    full += chunk;

    socket.emit("assistant:token", {
      id: msgId,
      chunk,
    });
  }

  await prisma.chatMessage.update({
    where: { id: msgId },
    data: { message: full },
  });

  socket.emit("assistant:done", {
    id: msgId,
    full,
  });
}
