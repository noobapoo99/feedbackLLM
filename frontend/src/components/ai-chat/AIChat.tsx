import { useEffect, useState } from "react";
import FloatingButton from "./FloatingButton";
import ChatDrawer from "./ChatDrawer";
import { fetchChats } from "../../utils/chatApi";
import { socket } from "../../utils/socket";

export default function AIChat() {
  const [open, setOpen] = useState(false);
  const [chats, setChats] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<any | null>(null);

  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    fetchChats()
      .then((data) => {
        setChats(data);

        // auto-select latest chat
        if (data.length && !activeChat) {
          setActiveChat(data[0]);
        }
      })
      .catch((err) => {
        console.error("Error fetching chats:", err);
      });
  }, [open]); // ✅ do NOT add activeChat here

  return (
    <>
      {!open && <FloatingButton onClick={() => setOpen(true)} />}

      {open && (
        <ChatDrawer
          chats={chats}
          setChats={setChats} // 🔑 pass setter
          activeChat={activeChat}
          setActiveChat={setActiveChat}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
