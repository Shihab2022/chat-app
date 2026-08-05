/* eslint-disable @typescript-eslint/no-explicit-any */
import { io, Socket } from "socket.io-client";
import {
  SET_ACTIVE_USERS,
  SET_END_TYPING_STATUS,
  SET_START_TYPING_STATUS,
} from "../redux/features/auth/authSlice";
import {
  DELETE_MESSAGE,
  REMOVE_EMOJI,
  SET_EMOJI_WITH_DATA,
  SET_REAL_TIME_CONVERSATION,
  UPDATE_EDITED_MESSAGE,
} from "../redux/features/chat/conversationSlice";
import { SOCKET_EVENTS } from "../constants/socket";
// import { TMessage } from "../types";
let lastStopTypingId: string | null = null;
const BASE_URL = import.meta.env.VITE_BASE_API_URL;
let socket: Socket | null = null;

export function connectSocket(userId: string, dispatch: any) {
  if (socket && socket.connected) return socket;
  socket = io(BASE_URL, {
    query: { userId },
  });

  socket.on(SOCKET_EVENTS.CONNECT, () => {
    console.log("✅ Socket connected");
  });

  socket.on(SOCKET_EVENTS.GET_ONLINE_USERS, (userIds) => {
    dispatch(SET_ACTIVE_USERS(userIds));
  });
  socket.on(SOCKET_EVENTS.NEW_MESSAGE, (msg) => {
    dispatch(SET_REAL_TIME_CONVERSATION(msg));
  });
  socket.on(SOCKET_EVENTS.NEW_EMOJI, (msg) => {
    dispatch(SET_EMOJI_WITH_DATA(msg));
  });
  socket.on(SOCKET_EVENTS.REMOVE_EMOJI, (msg) => {
    dispatch(REMOVE_EMOJI(msg));
  });

  // ✅ Typing events
  socket.on(SOCKET_EVENTS.USER_TYPING, ({ sender_id }) => {
    dispatch(SET_START_TYPING_STATUS(sender_id));
  });

  socket.on(SOCKET_EVENTS.USER_STOP_TYPING, ({ sender_id }) => {
    dispatch(SET_END_TYPING_STATUS(sender_id));
  });
  socket.on(SOCKET_EVENTS.EDIT_MESSAGE, (msg) => {
    dispatch(UPDATE_EDITED_MESSAGE(msg));
  });
  socket.on(SOCKET_EVENTS.DELETED_MESSAGE, (msg) => {
    dispatch(DELETE_MESSAGE(msg));
  });
  socket.on(SOCKET_EVENTS.FORWARD_MESSAGE, (msg) => {
    dispatch(SET_REAL_TIME_CONVERSATION(msg));
  });
  socket.on(SOCKET_EVENTS.MESSAGE_SEEN_UPDATE, ({ messageId, userId }) => {
    console.log("Message seen update received:", { messageId, userId });
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
  socket?.emit(SOCKET_EVENTS.TYPING, { receiverId });
  lastStopTypingId = receiverId;
}

// Emit stop typing event
export function emitStopTyping(receiverId: string) {
  socket?.emit(SOCKET_EVENTS.STOP_TYPING, { receiverId });
  lastStopTypingId = null;
}
export function emitMessageSeen(receiverId: string, msgId: string) {
  socket?.emit(SOCKET_EVENTS.MESSAGE_SEEN, {
    messageId: msgId,
    userId: receiverId,
  });
}
export function getSocket() {
  return socket;
}
