import { createSlice } from "@reduxjs/toolkit";

export type TConversation = {
  activeUsers?: string[];
  loginUser?: object;
};
const initialState: TConversation = {
  loginUser: {},
  activeUsers: [],
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
  },
});

export const { setUser, SET_ACTIVE_USERS } = authSlice.actions;
export default authSlice.reducer;
