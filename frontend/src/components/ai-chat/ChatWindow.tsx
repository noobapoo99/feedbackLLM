import { useEffect, useRef, useState } from "react";
import { fetchMessages, sendMessage } from "../../utils/chatApi";
import { useLocation, useNavigate } from "react-router-dom";
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

  const location = useLocation();
  const navigate = useNavigate();

  /* ---------------- CONTEXT ---------------- */
  const context = {
    page: {
      name: location.pathname.includes("reviews")
        ? "reviews"
        : location.pathname.includes("analytics")
        ? "analytics"
        : "dashboard",
      route: location.pathname,
    },
    uiState: {}, // expandable later
  };

  /* ---------------- FETCH CHAT ---------------- */
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

  /* ---------------- AUTO SCROLL ---------------- */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ---------------- AI ACTION LISTENER (STEP C) ---------------- */
  useEffect(() => {
    socket.on("assistant:action", (action) => {
      console.log("🤖 AI Action received:", action);

      switch (action.action) {
        case "set_chart":
          window.dispatchEvent(
            new CustomEvent("ai:set-chart", {
              detail: action.payload.chart,
            })
          );
          break;

        case "apply_filter":
          window.dispatchEvent(
            new CustomEvent("ai:apply-filter", {
              detail: action.payload,
            })
          );
          break;

        case "navigate":
          navigate(action.payload.route);
          break;

        default:
          console.warn("Unknown AI action:", action);
      }
    });

    return () => {
      socket.off("assistant:action");
    };
  }, [navigate]);

  /* ---------------- SEND MESSAGE ---------------- */
  const handleSend = async (text: string) => {
    if (!chat) return;

    const tempId = `temp-${Date.now()}`;
    const optimistic = {
      id: tempId,
      sender: "user",
      message: text,
    };

    setMessages((prev) => [...prev, optimistic]);

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

  /* ---------------- EMPTY STATE ---------------- */
  if (!chat) {
    return (
      <section className="flex-1 flex items-center justify-center">
        <p className="opacity-60">Select or create a chat</p>
      </section>
    );
  }

  /* ---------------- UI ---------------- */
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
