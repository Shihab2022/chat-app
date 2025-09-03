/* eslint-disable @typescript-eslint/no-explicit-any */
import { io, Socket } from "socket.io-client";
import { SET_ACTIVE_USERS } from "../redux/features/auth/authSlice";
import {
  SET_EMOJI_WITH_DATA,
  SET_REAL_TIME_CONVERSATION,
} from "../redux/features/chat/getConversationSlice";

const BASE_URL = import.meta.env.VITE_BASE_API_URL;
let socket: Socket | null = null;

export function connectSocket(userId: string, dispatch: any) {
  if (socket && socket.connected) return socket;
  socket = io(BASE_URL, {
    query: { userId },
  });

  socket.on("connect", () => {
    // console.log("✅ Socket connected");
  });

  socket.on("getOnlineUsers", (userIds) => {
    dispatch(SET_ACTIVE_USERS(userIds));
    // console.log("📡 Online users:", userIds);
  });
  socket.on("newMessage", (msg) => {
    dispatch(SET_REAL_TIME_CONVERSATION(msg));
  });
  socket.on("newEmoji", (msg) => {
    dispatch(SET_EMOJI_WITH_DATA(msg));
  });
  return socket;
}

export function disconnectSocket() {
  if (socket?.connected) {
    socket.disconnect();
    socket = null;
    console.log("❌ Socket disconnected");
  }
}

export function getSocket() {
  return socket;
}
