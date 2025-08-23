import { createSlice } from "@reduxjs/toolkit";
import {
  addMessageToGroups,
  formatFirstMessage,
} from "../../../utils/timeFormat";
import { TConversationState } from "../../../types";

const initialState: TConversationState = {
  messages: {},
  receiverId: "",
  isEmojiOpen: false,
  anchorElEmoji: null,
  isOneIcon: false,
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
    SET_EMOJI_STATUS: (state, action) => {
      state.isEmojiOpen = action.payload;
    },
    SET_ONE_ICON: (state, action) => {
      state.isOneIcon = action.payload;
    },
    SET_EMOJI_ANCHOR_EL: (state, action) => {
      state.anchorElEmoji = action.payload;
    },
  },
});

export const {
  SET_CONVERSATION,
  SET_REAL_TIME_CONVERSATION,
  SET_RECEIVER_ID,
  SET_EMOJI_STATUS,
  SET_EMOJI_ANCHOR_EL,
  SET_ONE_ICON,
} = conversationSlice.actions;
export default conversationSlice.reducer;
