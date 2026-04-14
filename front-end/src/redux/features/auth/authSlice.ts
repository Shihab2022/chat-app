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
  },
});

export const {
  setUser,
  SET_ACTIVE_USERS,
  SET_ALL_USERS,
  SET_START_TYPING_STATUS,
  SET_END_TYPING_STATUS,
} = authSlice.actions;
export default authSlice.reducer;
