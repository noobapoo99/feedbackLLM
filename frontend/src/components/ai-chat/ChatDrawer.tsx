import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";
import type { Dispatch, SetStateAction } from "react";

interface Props {
  chats: any[];
  activeChat: any;
  setChats: Dispatch<SetStateAction<any[]>>;
  setActiveChat: Dispatch<SetStateAction<any | null>>;
  onClose: () => void;
}

export default function ChatDrawer({
  chats,
  activeChat,
  setChats,
  setActiveChat,
  onClose,
}: Props) {
  return (
    // FULLSCREEN WRAPPER — forces bottom alignment
    <div className="fixed inset-0  right-0 z-40 flex justify-center items-end">
      {/* Backdrop (optional, soft) */}
      <div className="absolute inset-0 bg-black/5" onClick={onClose} />

      {/* BOTTOM DRAWER */}
      <div
        className="
          relative
          w-full max-w-none

          h-[50vh]
          bg-base-100
          shadow-2xl
          rounded-t-2xl   /* 👈 ONLY TOP ROUNDED */
          flex
          mb-4            /* 👈 spacing from bottom */
        "
      >
        <ChatSidebar
          chats={chats}
          setChats={setChats}
          activeChat={activeChat}
          setActiveChat={setActiveChat}
        />
        <ChatWindow chat={activeChat} onClose={onClose} />
      </div>
    </div>
  );
}
