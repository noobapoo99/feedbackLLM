import { useState } from "react";
import FloatingButton from "./FLoatingButton";
import ChatDrawer from "./ChatDrawer";

export default function AIChat() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Show Ask AI button ONLY when chat is closed */}
      {!open && <FloatingButton onClick={() => setOpen(true)} />}

      {/* Show chat ONLY when open */}
      {open && <ChatDrawer onClose={() => setOpen(false)} />}
    </>
  );
}
