/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";
import { TConversation, TUser } from "../../../types";

const initialState: TConversation = {
  loginUser: {
    id: "",
  },
  activeUsers: [],
  allUsers: [],
};
const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.loginUser = action.payload;
    },
    SET_ACTIVE_USERS: (state, action) => {
      state.activeUsers = action?.payload;
    },
    SET_ALL_USERS: (state, action) => {
      state.allUsers = action?.payload;
    },
    SET_START_TYPING_STATUS: (state, action) => {
      state.allUsers = state.allUsers.map((user: TUser) =>
        user?.id?.toString() === action.payload.toString()
          ? {
              ...user,
              isTyping: true,
            }
          : { ...user },
      );
    },
    SET_END_TYPING_STATUS: (state, action) => {
      state.allUsers = state.allUsers.map((user: TUser) =>
        user?.id?.toString() === action.payload.toString()
          ? {
              ...user,
              isTyping: false,
            }
          : { ...user },
      );
    },
    CLEAR_UNREAD_FOR_PEER: (state, action) => {
      const peerId = String(action.payload);
      state.allUsers = state.allUsers.map((user: TUser) =>
        String(user.id) === peerId ? { ...user, unreadCount: 0 } : user,
      );
    },
    UPDATE_PEER_LAST_MESSAGE: (state, action) => {
      const { peerId, lastMessage } = action.payload;
      state.allUsers = state.allUsers.map((user: TUser) =>
        String(user.id) === String(peerId)
          ? {
              ...user,
              lastMessage,
              updatedAt: lastMessage?.created_at,
            }
          : user,
      );
    },
    INCREMENT_UNREAD_FOR_PEER: (state, action) => {
      const { peerId, lastMessage } = action.payload;
      state.allUsers = state.allUsers.map((user: TUser) =>
        String(user.id) === String(peerId)
          ? {
              ...user,
              lastMessage,
              updatedAt: lastMessage?.created_at,
              unreadCount: (user.unreadCount || 0) + 1,
            }
          : user,
      );
    },
  },
});

export const {
  setUser,
  SET_ACTIVE_USERS,
  SET_ALL_USERS,
  SET_START_TYPING_STATUS,
  SET_END_TYPING_STATUS,
  CLEAR_UNREAD_FOR_PEER,
  UPDATE_PEER_LAST_MESSAGE,
  INCREMENT_UNREAD_FOR_PEER,
} = authSlice.actions;
export default authSlice.reducer;
