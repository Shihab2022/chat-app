import { createSlice } from "@reduxjs/toolkit";
import {
  addMessageToGroups,
  formatFirstMessage,
} from "../../../utils/timeFormat";

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
  messages: {};
  receiverId: string;
};
const initialState: TConversation = {
  messages: {},
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
        if (Object.keys(state.messages).length > 0) {
          const addedMessage = addMessageToGroups(
            state.messages,
            action.payload
          );
          state.messages = addedMessage;
        } else {
          const addedMessage = formatFirstMessage(action.payload);
          state.messages = addedMessage;
        }
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
