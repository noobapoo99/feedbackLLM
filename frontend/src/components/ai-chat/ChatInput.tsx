import { useState } from "react";

export default function ChatInput() {
  const [value, setValue] = useState("");

  const send = () => {
    if (!value.trim()) return;
    console.log("Send:", value);
    setValue("");
  };

  return (
    <div className="border-t p-4 flex gap-2 bg-base-100 sticky bottom-0">
      <input
        className="input input-bordered flex-1 rounded-full"
        placeholder="Ask something…"
      />
      <button className="btn btn-primary rounded-full">Send</button>
    </div>
  );
}
