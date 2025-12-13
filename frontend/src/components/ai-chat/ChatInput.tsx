import { useState } from "react";

export default function ChatInput({ chatId }: { chatId?: string }) {
  return (
    <div className="border-t p-4 flex gap-2 bg-base-100 sticky bottom-0">
      <input
        disabled
        className="input input-bordered flex-1 rounded-full"
        placeholder="Ask something…"
      />
      <button className="btn btn-primary rounded-full">Send</button>
    </div>
  );
}
