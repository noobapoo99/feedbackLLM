//const API = "http://localhost:5001";
// src/utils/chatApi.ts

import { API } from "./api"; // adjust path if needed

export async function fetchChats() {
  const res = await API.get("/chat");
  return res.data;
}

export async function fetchMessages(chatId: string) {
  const res = await API.get(`/chat/${chatId}/messages`);
  return res.data;
}

export async function createChat() {
  const res = await API.post("/chat");
  return res.data;
}

export async function sendMessage(chatId: string, message: string) {
  const res = await API.post(`/chat/${chatId}/messages/new`, {
    message,
  });
  return res.data;
}

export async function updateChat(chatId: string, title: string) {
  const res = await API.patch(`/chat/${chatId}`, {
    title,
  });
  return res.data;
}

/* 
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

export async function updateChat(chatId: string, title: string) {
  const token = localStorage.getItem("token");

  const res = await fetch(`http://localhost:5001/chat/${chatId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title }),
  });

  if (!res.ok) throw new Error("Failed to update chat");
  return res.json();
}
 */
