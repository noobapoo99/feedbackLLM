import { io, Socket } from "socket.io-client";

const BASE_URL = import.meta.env.VITE_API_URL;

export const socket: Socket = io(BASE_URL, {
  autoConnect: false,
  transports: ["websocket"],
  auth: {
    token: localStorage.getItem("token"),
  },
  withCredentials: true,
});
