import { useState } from "react";

export default function ChatInput({ onSend }: { onSend: (t: string) => void }) {
  const [value, setValue] = useState("");

  const send = () => {
    if (!value.trim()) return;
    onSend(value.trim());
    setValue("");
  };

  return (
    <div className="border-t p-4 flex gap-2 items-center">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Ask something…"
        className="input input-bordered flex-1 rounded-full px-4 py-2"
        onKeyDown={(e) => e.key === "Enter" && send()}
      />
      <button
        onClick={send}
        className={`btn px-4 py-2 rounded-full flex items-center gap-2 ${
          value.trim() ? "btn-primary shadow" : "btn-disabled"
        }`}
        disabled={!value.trim()}
        aria-label="Send message"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 5v14m7-7H5"
          />
        </svg>
        <span className="hidden sm:inline">Send</span>
      </button>
    </div>
  );
}
