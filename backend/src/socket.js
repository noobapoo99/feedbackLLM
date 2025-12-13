import { startAssistantStream } from "./streaming.js";

export function registerSocketHandlers(io) {
  io.on("connection", (socket) => {
    console.log("🔌 Socket connected:", socket.user.id);

    socket.on("user:message", async ({ chatId }) => {
      try {
        // ✅ Just trigger assistant stream
        await startAssistantStream(io, socket, chatId);
      } catch (err) {
        console.error("assistant stream error:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected:", socket.user.id);
    });
  });
}
