import { useEffect, useRef, useState } from "react";
import { fetchMessages, sendMessage } from "../../utils/chatApi";
import { useLocation } from "react-router-dom";
import { socket } from "../../utils/socket";
import ChatInput from "./ChatInput";

interface Props {
  chat: any;
  onClose: () => void;
}

export default function ChatWindow({ chat, onClose }: Props) {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const location = useLocation(); // ✅ hook INSIDE component

  // ✅ build context INSIDE component
  const context = {
    page: {
      name: location.pathname.includes("reviews")
        ? "reviews"
        : location.pathname.includes("analytics")
        ? "analytics"
        : "dashboard",
      route: location.pathname,
    },
    uiState: {}, // keep empty for now
  };

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

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!chat) return;

    // 1️⃣ optimistic UI
    const tempId = `temp-${Date.now()}`;
    const optimistic = {
      id: tempId,
      sender: "user",
      message: text,
    };

    setMessages((prev) => [...prev, optimistic]);

    try {
      // 2️⃣ persist user message
      const saved = await sendMessage(chat.id, text);

      // 3️⃣ replace optimistic
      setMessages((prev) => prev.map((m) => (m.id === tempId ? saved : m)));

      // 4️⃣ trigger assistant with context ✅ (THIS WAS MISSING)
      socket.emit("user:message", {
        chatId: chat.id,
        message: text,
        context,
      });
    } catch (e) {
      // rollback
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      alert("Failed to send message");
    }
  };

  if (!chat) {
    return (
      <section className="flex-1 flex items-center justify-center">
        <p className="opacity-60">Select or create a chat</p>
      </section>
    );
  }

  return (
    <section className="flex-1 flex flex-col bg-base-100">
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
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading && <p className="opacity-60">Loading…</p>}

        {!loading &&
          messages.map((m) => (
            <div
              key={m.id}
              className={`chat ${
                m.sender === "user" ? "chat-end" : "chat-start"
              }`}
            >
              <div
                className={`chat-bubble ${
                  m.sender === "user" ? "chat-bubble-primary" : ""
                }`}
              >
                {m.message}
              </div>
            </div>
          ))}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <ChatInput onSend={handleSend} />
    </section>
  );
}
