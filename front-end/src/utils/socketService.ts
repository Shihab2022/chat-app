// services/socketService.ts
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

const BASE_URL = import.meta.env.VITE_BASE_API_URL;
// const BASE_URL =
//   import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export function connectSocket(userId: string) {
  if (socket?.connected) return socket; // already connected

  socket = io(BASE_URL, {
    query: { userId },
  });

  socket.on("connect", () => {
    console.log("✅ Socket connected");
  });

  socket.on("getOnlineUsers", (userIds) => {
    console.log("📡 Online users:", userIds);
  });

  return socket;
}

export function disconnectSocket() {
  if (socket?.connected) {
    socket.disconnect();
    console.log("❌ Socket disconnected");
  }
}

export function getSocket() {
  return socket;
}
