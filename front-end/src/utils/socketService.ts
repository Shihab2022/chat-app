import { io } from "socket.io-client";

const BASE_URL = import.meta.env.VITE_BASE_API_URL;

export function connectSocket(userId: string) {
  // if (socket?.connected) return socket; // already connected
  console.log({ userId });
  const socket = io(BASE_URL, {
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

// export function disconnectSocket() {
//   if (socket?.connected) {
//     socket.disconnect();
//     console.log("❌ Socket disconnected");
//   }
// }

// export function getSocket() {
//   return socket;
// }
