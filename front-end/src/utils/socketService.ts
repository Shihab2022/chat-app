/* eslint-disable @typescript-eslint/no-explicit-any */
import { io, Socket } from "socket.io-client";
import {
  SET_ACTIVE_USERS,
  SET_ALL_USERS,
  SET_END_TYPING_STATUS,
  SET_START_TYPING_STATUS,
  CLEAR_UNREAD_FOR_PEER,
  INCREMENT_UNREAD_FOR_PEER,
} from "../redux/features/auth/authSlice";
import {
  DELETE_MESSAGE,
  REMOVE_EMOJI,
  SET_CONVERSATION,
  SET_EMOJI_WITH_DATA,
  SET_MESSAGE_SEEN_UPDATE,
  SET_REAL_TIME_CONVERSATION,
  SET_RECEIVER_ID,
  SET_RIGHT_SIDEBAR_OPEN_STATUS,
  UPDATE_EDITED_MESSAGE,
} from "../redux/features/chat/conversationSlice";
import { SOCKET_EVENTS } from "../constants/socket";
import { getGroupDetailsAPI } from "../services/message";
// import { TMessage } from "../types";
let lastStopTypingId: string | null = null;
const BASE_URL = import.meta.env.VITE_BASE_API_URL;
let socket: Socket | null = null;

export function connectSocket(userId: string, dispatch: any) {
  if (socket && socket.connected) return socket;
  socket = io(BASE_URL, {
    query: { userId },
  });

  const applyGroupToSidebar = (group: any) => {
    return (innerDispatch: any, getState: any) => {
      const currentUsers = getState()?.auth?.allUsers || [];
      const loginUser = getState()?.auth?.loginUser || {};
      const groupId = String(group.id ?? group.group_id);
      const members = Array.isArray(group.members) ? group.members : [];

      // If I am no longer a member, remove the group from my sidebar.
      const isStillMember =
        members.length === 0 ||
        members.some(
          (m: any) => String(m.id ?? m.user_id) === String(loginUser?.id),
        );

      if (!isStillMember) {
        innerDispatch(
          SET_ALL_USERS(currentUsers.filter((u: any) => String(u.id) !== groupId)),
        );
        return;
      }

      const normalizedGroup = {
        ...group,
        id: groupId,
        name: group.name,
        description: group.description || "",
        isGroup: true,
        img: group.img || "",
        members,
      };

      const existingIndex = currentUsers.findIndex(
        (u: any) => String(u.id) === groupId,
      );
      if (existingIndex >= 0) {
        const nextUsers = [...currentUsers];
        nextUsers[existingIndex] = {
          ...nextUsers[existingIndex],
          ...normalizedGroup,
        };
        innerDispatch(SET_ALL_USERS(nextUsers));
      } else {
        innerDispatch(SET_ALL_USERS([normalizedGroup, ...currentUsers]));
      }
    };
  };

  const handleGroupEvent = (_event: string, group: any) => {
    if (!group) return;
    if (group.groupId && !group.members && !group.name) {
      // Light payload (e.g. groupDeleted) - just remove from sidebar.
      const groupId = String(group.groupId);
      dispatch((innerDispatch: any, getState: any) => {
        const state = getState();
        const currentUsers = state?.auth?.allUsers || [];
        const cleared = currentUsers.filter((u: any) => String(u.id) !== groupId);
        innerDispatch(
          SET_ALL_USERS(cleared),
        );
        if (String(state?.message?.receiverId ?? "") === groupId) {
          innerDispatch(SET_RECEIVER_ID(""));
          innerDispatch(SET_CONVERSATION({}));
          innerDispatch(SET_RIGHT_SIDEBAR_OPEN_STATUS(false));
        }
      });
      return;
    }
    if (group.id ?? group.group_id) {
      if (!group.members && group.group_id) {
        getGroupDetailsAPI(group.group_id).then((res) => {
          if (res?.success && res.data) dispatch(applyGroupToSidebar(res.data));
        });
      } else {
        dispatch(applyGroupToSidebar(group));
      }
    }
  };

  socket.on(SOCKET_EVENTS.CONNECT, () => {
    console.log("✅ Socket connected");
  });

  socket.on(SOCKET_EVENTS.GET_ONLINE_USERS, (userIds) => {
    dispatch(SET_ACTIVE_USERS(userIds));
  });
  socket.on(SOCKET_EVENTS.NEW_MESSAGE, (msg) => {
    dispatch((innerDispatch: any, getState: any) => {
      const state = getState();
      const currentReceiverId = String(state?.message?.receiverId ?? "");
      const senderId = String(msg?.sender_id ?? "");
      const isCurrentChat = senderId === currentReceiverId;

      innerDispatch(SET_REAL_TIME_CONVERSATION(msg));

      if (senderId) {
        if (isCurrentChat) {
          innerDispatch(CLEAR_UNREAD_FOR_PEER(senderId));
        } else {
          innerDispatch(
            INCREMENT_UNREAD_FOR_PEER({
              peerId: senderId,
              lastMessage: msg,
            }),
          );
        }
      }
    });
  });
  socket.on(SOCKET_EVENTS.NEW_GROUP_MESSAGE, (msg) => {
    dispatch(SET_REAL_TIME_CONVERSATION(msg));
    if (msg?.group_id) {
      dispatch((innerDispatch: any, getState: any) => {
        const currentUsers = getState()?.auth?.allUsers || [];
        const groupId = String(msg.group_id);
        const nextUsers = currentUsers.map((user: any) =>
          String(user.id) === groupId
            ? {
                ...user,
                lastMessage: {
                  id: msg.id,
                  text: msg.text,
                  sender_id: msg.sender_id,
                  created_at: msg.created_at,
                },
                updatedAt: msg.created_at,
              }
            : user,
        );

        if (!nextUsers.some((user: any) => String(user.id) === groupId)) {
          nextUsers.unshift({
            id: groupId,
            name: `Group ${groupId}`,
            isGroup: true,
            img: "",
            members: [],
            lastMessage: {
              id: msg.id,
              text: msg.text,
              sender_id: msg.sender_id,
              created_at: msg.created_at,
            },
          });
        }

        innerDispatch(SET_ALL_USERS(nextUsers));
      });
    }
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
  socket.on(SOCKET_EVENTS.MESSAGE_SEEN_UPDATE, ({ messageId, seen_at }) => {
    dispatch(SET_MESSAGE_SEEN_UPDATE({ messageId, seen_at }));
  });
  socket.on(SOCKET_EVENTS.GROUP_CREATED, (group) =>
    handleGroupEvent(SOCKET_EVENTS.GROUP_CREATED, group),
  );
  socket.on(SOCKET_EVENTS.GROUP_MEMBER_CHANGED, (group) =>
    handleGroupEvent(SOCKET_EVENTS.GROUP_MEMBER_CHANGED, group),
  );
  socket.on(SOCKET_EVENTS.GROUP_UPDATED, (group) =>
    handleGroupEvent(SOCKET_EVENTS.GROUP_UPDATED, group),
  );
  socket.on(SOCKET_EVENTS.GROUP_DELETED, (payload) =>
    handleGroupEvent(SOCKET_EVENTS.GROUP_DELETED, payload),
  );
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
