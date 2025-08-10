import { createSlice } from "@reduxjs/toolkit";

export type TConversation = {
  name: string | null;
  lastMessage?: string;
  time?: string;
  img?: string;
  id: string | null;
  email: string | null;
  userName: string | null;
  activeUsers?: string[];
};
const initialState: TConversation = {
  name: null,
  email: null,
  userName: null,
  id: null,
  activeUsers: [],
};
const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.userName = action.payload.userName;
      state.id = action.payload._id;
    },
    SET_ACTIVE_USERS: (state, action) => {
      state.activeUsers = action?.payload;
    },
  },
});

export const { setUser, SET_ACTIVE_USERS } = authSlice.actions;
export default authSlice.reducer;
