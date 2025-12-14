import { startAssistantStream } from "./streaming.js";

export function registerSocketHandlers(io) {
  io.on("connection", (socket) => {
    console.log(
      "🔌 Socket connected:",
      socket.user ? socket.user.id : "NO USER"
    );

    socket.on("user:message", async ({ chatId, message, context }) => {
      try {
        console.log("User message:", message);
        console.log("Context:", context);

        const finalContext = {
          user: {
            id: socket.user.id,
            role: socket.user.role,
          },
          page: context.page,
          uiState: context.uiState,
          message,
        };

        await startAssistantStream(io, socket, chatId, finalContext);
      } catch (err) {
        console.error("assistant stream error:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log(
        "❌ Socket disconnected:",
        socket.user ? socket.user.id : "NO USER"
      );
    });
  });
}
