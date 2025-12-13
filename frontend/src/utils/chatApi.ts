const API = "http://localhost:5001";

export async function fetchChats() {
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:5001/chat", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch chats");
  return res.json();
}

export async function fetchMessages(chatId: string) {
  const token = localStorage.getItem("token");

  const res = await fetch(`http://localhost:5001/chat/${chatId}/messages`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch messages");
  return res.json();
}

export async function createChat() {
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:5001/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to create chat");
  return res.json();
}
export async function sendMessage(chatId: string, message: string) {
  const token = localStorage.getItem("token");

  const res = await fetch(`http://localhost:5001/chat/${chatId}/messages/new`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ message }),
  });

  if (!res.ok) throw new Error("Failed to send message");
  return res.json();
}
