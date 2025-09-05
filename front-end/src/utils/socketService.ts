/* eslint-disable @typescript-eslint/no-explicit-any */
import { io, Socket } from "socket.io-client";
import { SET_ACTIVE_USERS } from "../redux/features/auth/authSlice";
import {
  SET_EMOJI_WITH_DATA,
  SET_END_TYPING_STATUS,
  SET_REAL_TIME_CONVERSATION,
  SET_START_TYPING_STATUS,
} from "../redux/features/chat/getConversationSlice";
let lastStopTypingId: string | null = null;
const BASE_URL = import.meta.env.VITE_BASE_API_URL;
let socket: Socket | null = null;

export function connectSocket(userId: string, dispatch: any) {
  if (socket && socket.connected) return socket;
  socket = io(BASE_URL, {
    query: { userId },
  });

  socket.on("connect", () => {
    console.log("✅ Socket connected");
  });

  socket.on("getOnlineUsers", (userIds) => {
    dispatch(SET_ACTIVE_USERS(userIds));
  });
  socket.on("newMessage", (msg) => {
    dispatch(SET_REAL_TIME_CONVERSATION(msg));
  });
  socket.on("newEmoji", (msg) => {
    dispatch(SET_EMOJI_WITH_DATA(msg));
  });

  // ✅ Typing events
  socket.on("userTyping", ({ senderId }) => {
    dispatch(SET_START_TYPING_STATUS(senderId));
  });

  socket.on("userStopTyping", ({ senderId }) => {
    dispatch(SET_END_TYPING_STATUS(senderId));
  });
  return socket;
}

export function disconnectSocket() {
  if (socket?.connected) {
    socket.disconnect();
    socket = null;
  }
}
export function emitTyping(receiverId: string) {
  if (lastStopTypingId === receiverId) {
    return;
  }
  socket?.emit("typing", { receiverId });
  lastStopTypingId = receiverId;
}

// Emit stop typing event
export function emitStopTyping(receiverId: string) {
  socket?.emit("stopTyping", { receiverId });
  lastStopTypingId = null;
}
export function getSocket() {
  return socket;
}
