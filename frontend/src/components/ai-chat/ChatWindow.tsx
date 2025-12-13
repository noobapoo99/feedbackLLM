import ChatInput from "./ChatInput";

interface Props {
  onClose: () => void;
}

export default function ChatWindow({ onClose }: Props) {
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
        <div className="chat chat-start">
          <div className="chat-bubble">
            Hi! Ask me anything about your dashboard.
          </div>
        </div>

        <div className="chat chat-end">
          <div className="chat-bubble chat-bubble-primary">
            Show my negative reviews
          </div>
        </div>
      </div>

      {/* Input */}
      <ChatInput />
    </section>
  );
}
