import { createSlice } from "@reduxjs/toolkit";

export type TConversation = {
  messages: string[];
};
const initialState: TConversation = {
  messages: [],
};
const conversationSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    SET_CONVERSATION: (state, action) => {
      state.messages = action.payload;
    },
    SET_REAL_TIME_CONVERSATION: (state, action) => {
      state.messages = [...state.messages, action.payload];
    },
  },
});

export const { SET_CONVERSATION, SET_REAL_TIME_CONVERSATION } =
  conversationSlice.actions;
export default conversationSlice.reducer;
