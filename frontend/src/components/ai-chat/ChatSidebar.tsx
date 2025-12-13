import { createChat } from "../../utils/chatApi";

interface Props {
  chats: any[];
  setChats: (c: any[]) => void;
  activeChat: any;
  setActiveChat: (c: any) => void;
}

export default function ChatSidebar({
  chats,
  setChats,
  activeChat,
  setActiveChat,
}: Props) {
  const handleNewChat = async () => {
    const chat = await createChat();
    setChats((prev) => [chat, ...prev]);
    setActiveChat({ ...chat }); // ✅ force new ref
  };

  return (
    <aside className="w-64 border-r border-base-300 p-4 hidden md:block">
      <button
        onClick={handleNewChat}
        className="btn btn-primary btn-sm w-full mb-4"
      >
        + New Chat
      </button>

      <div className="flex flex-col gap-2">
        {chats.length === 0 && (
          <p className="text-sm opacity-60">No chats yet</p>
        )}

        {chats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => setActiveChat({ ...chat })} // ✅ HERE
            className={`btn btn-ghost justify-start ${
              activeChat?.id === chat.id ? "btn-active" : ""
            }`}
          >
            {chat.title || "New Chat"}
          </button>
        ))}
      </div>
    </aside>
  );
}
