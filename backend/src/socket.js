import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();

import { startAssistantStream } from "./streaming.js";

export function registerSocketHandlers(io) {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // When user sends a message
    socket.on("user:message", async ({ chatId, message }) => {
      console.log("Incoming user message:", message);

      const userMsg = await prisma.chatMessage.create({
        data: {
          chatId,
          sender: "user",
          message,
        },
      });

      // Send message back to React UI
      socket.emit("message:added", userMsg);

      // Trigger assistant stream
      startAssistantStream(io, socket, chatId);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
}
