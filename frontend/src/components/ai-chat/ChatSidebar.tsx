const mockChats = [
  { id: "1", title: "Review insights" },
  { id: "2", title: "Product analysis" },
];

export default function ChatSidebar() {
  return (
    <aside className="w-64 bg-base-200 border-r border-base-300 p-4 hidden md:block">
      <h3 className="font-bold mb-4 text-sm uppercase opacity-70">Chats</h3>

      <div className="flex flex-col gap-2">
        {mockChats.map((chat) => (
          <button key={chat.id} className="btn btn-ghost justify-start text-sm">
            {chat.title}
          </button>
        ))}
      </div>
    </aside>
  );
}
