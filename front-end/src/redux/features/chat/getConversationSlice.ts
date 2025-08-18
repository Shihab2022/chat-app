import { createSlice } from "@reduxjs/toolkit";

export type TMessage = {
  _id: string; // comes as string in JSON
  senderId: string;
  receiverId: string;
  text?: string;
  image?: string;
  createdAt: string; // usually ISO string from backend
  updatedAt: string;
  time?: string;
};
export type TConversation = {
  messages: TMessage[];
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
