import fetch from "node-fetch";
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

        // 1️⃣ Detect intent using Python
        const intentRes = await fetch("http://localhost:8000/chat-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: message }),
        });

        const rawIntent = await intentRes.json();

        const intent = {
          type: rawIntent.intent ?? "unknown",
          chart: rawIntent.chart,
        };

        const finalContext = {
          user: {
            id: socket.user.id,
            role: socket.user.role,
          },
          page: context.page,
          uiState: context.uiState,
          intent, // ✅ now has `type`
          message,
        };

        // 3️⃣ Stream assistant with full context
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
