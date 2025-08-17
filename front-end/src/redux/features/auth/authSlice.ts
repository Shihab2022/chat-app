/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";

export type TUser = {
  _id: string; // 👈 add any property you expect
} & Record<string, any>;
export type TConversation = {
  activeUsers?: string[];
  loginUser: TUser;
  allUsers?: any;
};
const initialState: TConversation = {
  loginUser: {
    _id: "",
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
  },
});

export const { setUser, SET_ACTIVE_USERS, SET_ALL_USERS } = authSlice.actions;
export default authSlice.reducer;
