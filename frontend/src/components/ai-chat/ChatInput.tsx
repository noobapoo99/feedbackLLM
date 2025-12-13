import { useState } from "react";

export default function ChatInput({ onSend }: { onSend: (t: string) => void }) {
  const [value, setValue] = useState("");

  const send = () => {
    if (!value.trim()) return;
    onSend(value.trim());
    setValue("");
  };

  return (
    <div className="border-t p-4 flex gap-2">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Ask something…"
        className="input input-bordered flex-1"
        onKeyDown={(e) => e.key === "Enter" && send()}
      />
      <button onClick={send} className="btn btn-primary">
        Send
      </button>
    </div>
  );
}
