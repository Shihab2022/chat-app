/* eslint-disable @typescript-eslint/no-explicit-any */
import { io } from "socket.io-client";
import { SET_ACTIVE_USERS } from "../redux/features/auth/authSlice";

const BASE_URL = import.meta.env.VITE_BASE_API_URL;

export function connectSocket(userId: string, dispatch?: any) {
  // if (socket?.connected) return socket; // already connected
  const socket = io(BASE_URL, {
    query: { userId },
  });

  socket.on("connect", () => {
    // console.log("✅ Socket connected");
  });

  socket.on("getOnlineUsers", (userIds) => {
    dispatch(SET_ACTIVE_USERS(userIds));
    // console.log("📡 Online users:", userIds);
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
