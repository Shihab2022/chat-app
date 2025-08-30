import { createSlice } from "@reduxjs/toolkit";
import {
  addMessageToGroups,
  formatDate,
  formatFirstMessage,
} from "../../../utils/timeFormat";
import { TConversationState } from "../../../types";
import { get } from "lodash";

const initialState: TConversationState = {
  messages: {},
  receiverId: "",
  isEmojiOpen: false,
  anchorElEmoji: null,
  isOneIcon: false,
  isEmojiAdded: false,
};
const conversationSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    SET_CONVERSATION: (state, action) => {
      state.messages = action.payload;
      state.isEmojiAdded = false;
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
      state.isEmojiAdded = false;
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
    SET_EMOJI_WITH_DATA: (state, action) => {
      state.isEmojiAdded = true;
      const formattedDate = formatDate(action.payload?.createdAt);
      const messagesForUpdate = get(state.messages, formattedDate, []);
      const newMessages = messagesForUpdate.map((item) =>
        item._id === action.payload._id ? action.payload : item
      );
      state.messages = { ...state.messages, [formattedDate]: newMessages };
      // state.messages = action.payload;
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
  SET_EMOJI_WITH_DATA,
} = conversationSlice.actions;
export default conversationSlice.reducer;
