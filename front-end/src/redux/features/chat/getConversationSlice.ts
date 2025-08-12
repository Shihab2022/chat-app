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
  },
});

export const { SET_CONVERSATION } = conversationSlice.actions;
export default conversationSlice.reducer;
