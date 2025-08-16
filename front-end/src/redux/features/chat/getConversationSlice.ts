import { createSlice } from "@reduxjs/toolkit";

export type TConversation = {
  messages: string[];
  receiverId: string;
};
const initialState: TConversation = {
  messages: [],
  receiverId: "",
};
const conversationSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    SET_CONVERSATION: (state, action) => {
      state.messages = action.payload;
    },
    SET_REAL_TIME_CONVERSATION: (state, action) => {
      if (action?.payload?.senderId === state.receiverId) {
        state.messages = [...state.messages, action.payload];
      }
    },
    SET_RECEIVER_ID: (state, action) => {
      state.receiverId = action.payload;
    },
  },
});

export const { SET_CONVERSATION, SET_REAL_TIME_CONVERSATION, SET_RECEIVER_ID } =
  conversationSlice.actions;
export default conversationSlice.reducer;
