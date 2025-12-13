import { useEffect, useState } from "react";
import { fetchMessages } from "../../utils/chatApi";
import ChatInput from "./ChatInput";

interface Props {
  chat: any;
  onClose: () => void;
}

export default function ChatWindow({ chat, onClose }: Props) {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!chat) {
      setMessages([]); // 🔑 reset messages
      return;
    }

    setLoading(true);
    fetchMessages(chat.id)
      .then(setMessages)
      .finally(() => setLoading(false));
  }, [chat?.id]);

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
      </div>

      {/* Input only when chat exists */}
      <ChatInput chatId={chat.id} />
    </section>
  );
}
