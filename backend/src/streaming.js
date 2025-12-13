import { PrismaClient } from "@prisma/client";
import fetch from "node-fetch";

export const prisma = new PrismaClient();

export async function startAssistantStream(io, socket, chatId, context) {
  console.log("🤖 AI streaming started…");
  console.log("CTX SENT TO PYTHON:", context);

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

  const response = await fetch("http://localhost:8000/chat-stream", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(context),
  });

  for await (const chunk of response.body) {
    const text = chunk.toString("utf-8");

    // 🔥 Detect action
    if (text.startsWith("__ACTION__")) {
      const action = JSON.parse(text.replace("__ACTION__", "").trim());

      // Send action to frontend
      socket.emit("assistant:action", action);
      continue;
    }

    // Normal text token
    full += text;
    socket.emit("assistant:token", {
      id: msgId,
      chunk: text,
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
