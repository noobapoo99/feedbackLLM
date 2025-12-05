import { useState } from "react";
import AnalystLayout from "../../layouts/AnalystLayout";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  return (
    <AnalystLayout>
      <div className="flex h-full">
        {/* LEFT Chat History Sidebar */}
        <aside className="w-60 bg-base-100 border-r p-4 overflow-y-auto">
          <h3 className="font-bold mb-3">Chat History</h3>

          {["Chat 1", "Chat 2", "Chat 3"].map((item) => (
            <div
              key={item}
              className="p-2 rounded bg-base-200 hover:bg-base-300 cursor-pointer mb-2"
            >
              {item}
            </div>
          ))}
        </aside>

        {/* MAIN CHAT AREA */}
        <div className="flex-1 flex flex-col">
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <p className="opacity-60">Ask anything about the reviews…</p>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`chat ${
                  msg.role === "user" ? "chat-end" : "chat-start"
                }`}
              >
                <div className="chat-bubble">{msg.text}</div>
              </div>
            ))}
          </div>

          {/* Bottom Chat Input Bar */}
          <div className="p-4 bg-base-100 border-t flex gap-3 sticky bottom-0">
            <input
              className="input input-bordered flex-1"
              placeholder="Type a question…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />

            <button
              className="btn btn-primary"
              onClick={() => {
                setMessages([...messages, { role: "user", text: input }]);
                setInput("");
              }}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </AnalystLayout>
  );
}
