import { io, Socket } from "socket.io-client";

const BASE_URL = import.meta.env.VITE_API_URL;

export let socket: Socket;

export const initSocket = () => {
  const token = localStorage.getItem("token");
  if (!token) return;

  socket = io(BASE_URL, {
    transports: ["websocket"],
    auth: { token },
    withCredentials: true,
  });
};

export const closeSocket = () => {
  socket?.disconnect();
};
