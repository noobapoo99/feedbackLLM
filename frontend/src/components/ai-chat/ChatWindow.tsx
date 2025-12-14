import { useEffect, useRef, useState } from "react";
import { fetchMessages, sendMessage } from "../../utils/chatApi";
import { useLocation, useNavigate } from "react-router-dom";
import { socket } from "../../utils/socket";
import ChatInput from "./ChatInput";

export default function ChatWindow({ chat, onClose }: any) {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  /* ---------- CONTEXT ---------- */
  const context = {
    page: {
      name: location.pathname.includes("reviews")
        ? "reviews"
        : location.pathname.includes("analytics")
        ? "analytics"
        : "dashboard",
      route: location.pathname,
    },
    uiState: {},
  };

  /* ---------- FETCH CHAT ---------- */
  useEffect(() => {
    if (!chat) {
      setMessages([]);
      return;
    }

    setLoading(true);
    fetchMessages(chat.id)
      .then(setMessages)
      .finally(() => setLoading(false));
  }, [chat?.id]);

  /* ---------- AUTOSCROLL ---------- */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ---------- SOCKET HANDLERS ---------- */
  useEffect(() => {
    /* assistant message created */
    socket.on("assistant:start", ({ id }) => {
      setMessages((prev) => [
        ...prev,
        { id, sender: "assistant", message: "" },
      ]);
    });

    socket.on("assistant:token", ({ id, chunk }) => {
      console.log("AI TOKEN:", chunk);

      if (chunk.startsWith("__ACTION__")) {
        const action = JSON.parse(chunk.replace("__ACTION__", ""));
        console.log("AI ACTION:", action);

        if (context.page.name === "reviews") {
          window.dispatchEvent(
            new CustomEvent("ai:reviews", { detail: action })
          );
        }

        return;
      }

      setMessages((prev) =>
        prev.map((m) =>
          m.id === id ? { ...m, message: m.message + chunk } : m
        )
      );
    });

    return () => {
      socket.off("assistant:start");
      socket.off("assistant:token");
    };
  }, [navigate]);

  /* ---------- SEND MESSAGE ---------- */
  const handleSend = async (text: string) => {
    if (!chat) return;

    const tempId = `temp-${Date.now()}`;

    setMessages((prev) => [
      ...prev,
      { id: tempId, sender: "user", message: text },
    ]);

    try {
      const saved = await sendMessage(chat.id, text);

      setMessages((prev) => prev.map((m) => (m.id === tempId ? saved : m)));

      socket.emit("user:message", {
        chatId: chat.id,
        message: text,
        context,
      });
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      alert("Failed to send message");
    }
  };

  /* ---------- EMPTY ---------- */
  if (!chat) {
    return (
      <section className="flex-1 flex items-center justify-center">
        <p className="opacity-60">Select or create a chat</p>
      </section>
    );
  }

  /* ---------- UI ---------- */
  return (
    <section className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-base-200">
        <div>
          <h3 className="font-semibold">AI Assistant</h3>
          <p className="text-xs opacity-70">
            Context-aware • Dashboard assistant
          </p>
        </div>
        <button onClick={onClose} className="btn btn-sm btn-ghost">
          ✕
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {loading && <p className="opacity-60">Loading…</p>}

        {!loading && messages.length === 0 && (
          <p className="text-sm opacity-60">No messages yet — say hello 👋</p>
        )}

        {messages.map((m) => {
          const isUser = m.sender === "user";

          return (
            <div
              key={m.id}
              className={`w-full flex ${
                isUser ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`inline-block p-3 max-w-[70%] break-words shadow-sm ${
                  isUser
                    ? "bg-green-600 text-white rounded-lg rounded-tr-none"
                    : "bg-gray-100 text-gray-800 rounded-lg rounded-tl-none"
                }`}
              >
                {m.message || (isUser ? "" : "...")}
              </div>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      <ChatInput onSend={handleSend} />
    </section>
  );
}
