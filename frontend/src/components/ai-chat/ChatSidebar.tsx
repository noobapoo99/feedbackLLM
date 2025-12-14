import { createChat, updateChat } from "../../utils/chatApi";
import { useState } from "react";

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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const handleNewChat = async () => {
    const chat = await createChat();
    setChats((prev) => [chat, ...prev]);
    setActiveChat({ ...chat }); // ✅ force new ref
  };

  const getInitials = (title?: string) => {
    if (!title) return "AI";
    const parts = title.trim().split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const formatDate = (iso?: string) => {
    if (!iso) return "";
    try {
      const d = new Date(iso);
      return d.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      });
    } catch {
      return "";
    }
  };

  return (
    <aside className="w-64 border-r border-base-300 p-4 hidden md:flex md:flex-col">
      <div className="flex items-center gap-2 mb-3">
        <button
          onClick={handleNewChat}
          className="btn btn-primary btn-sm flex-1"
        >
          + New Chat
        </button>
      </div>

      <div className="text-xs text-gray-500 mb-2">Chats</div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-2">
        {chats.length === 0 && (
          <p className="text-sm opacity-60">No chats yet</p>
        )}

        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`group flex items-center gap-3 p-2 rounded-md transition-colors cursor-pointer ${
              activeChat?.id === chat.id ? "bg-base-200" : "hover:bg-base-200"
            }`}
            onClick={() => setActiveChat({ ...chat })}
            title={chat.title || "New Chat"}
          >
            <div className="w-10 h-10 flex-shrink-0 rounded-full bg-gray-200 text-sm font-semibold text-gray-700 flex items-center justify-center">
              {getInitials(chat.title)}
            </div>

            <div className="flex-1 min-w-0">
              {editingId === chat.id ? (
                <input
                  className="input input-sm w-full"
                  value={editingTitle}
                  autoFocus
                  onChange={(e) => setEditingTitle(e.target.value)}
                  onKeyDown={async (e) => {
                    if (e.key === "Enter") {
                      try {
                        const updated = await updateChat(chat.id, editingTitle);
                        setChats((prev) =>
                          prev.map((c) => (c.id === chat.id ? updated : c))
                        );
                        setActiveChat({ ...updated });
                      } catch (err) {
                        alert("Failed to update chat title");
                      } finally {
                        setEditingId(null);
                        setEditingTitle("");
                      }
                    } else if (e.key === "Escape") {
                      setEditingId(null);
                      setEditingTitle("");
                    }
                  }}
                  onBlur={() => {
                    setEditingId(null);
                    setEditingTitle("");
                  }}
                />
              ) : (
                <div className="min-w-0">
                  <div className="truncate font-medium text-sm">
                    {chat.title || "New Chat"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatDate(chat.createdAt)}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingId(chat.id);
                  setEditingTitle(chat.title || "");
                }}
                className="opacity-0 group-hover:opacity-100 transition"
                aria-label="Rename chat"
              >
                ✎
              </button>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
