import { createSlice } from "@reduxjs/toolkit";
import {
  addMessageToGroups,
  formatFirstMessage,
} from "../../../utils/timeFormat";
import { GroupedMessages, TConversationState } from "../../../types";
import { formateMessageAndUpdate } from "../../../utils/common";

const initialState: TConversationState = {
  messages: {},
  receiverId: "",
  isEmojiOpen: false,
  anchorElEmoji: null,
  isOneIcon: false,
  isEmojiAdded: false,
  selectedMessage: {},
  emojiDetailsDialogStatus: false,
  selectedReactions: [],
  editedMessage: {},
  repliedMessage: {},
  isRightSidebarOpen: false,
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
      if (action?.payload?.sender_id === state.receiverId) {
        if (Object.keys(state.messages).length > 0) {
          const addedMessage = addMessageToGroups(
            state.messages,
            action.payload,
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
    SET_SELECTED_MESSAGE: (state, action) => {
      state.selectedMessage = action.payload;
    },
    SET_EMOJI_DETAILS_DIALOG_STATUS: (state, action) => {
      state.emojiDetailsDialogStatus = action.payload;
    },
    SET_EMOJI_DETAILS_REACTIONS: (state, action) => {
      state.selectedReactions = action.payload;
    },
    SET_EDITED_MESSAGE: (state, action) => {
      state.editedMessage = action.payload;
    },
    UPDATE_EDITED_MESSAGE: (state, action) => {
      state.messages = formateMessageAndUpdate(
        action.payload,
        state.messages,
      ) as GroupedMessages;
      state.editedMessage = {};
    },
    DELETE_MESSAGE: (state, action) => {
      state.messages = formateMessageAndUpdate(
        action.payload,
        state.messages,
      ) as GroupedMessages;
      state.editedMessage = {};
    },
    SET_EMOJI_WITH_DATA: (state, action) => {
      state.isEmojiAdded = true;
      state.messages = formateMessageAndUpdate(
        action.payload,
        state.messages,
      ) as GroupedMessages;
    },
    REMOVE_EMOJI: (state, action) => {
      state.messages = formateMessageAndUpdate(
        action.payload,
        state.messages,
      ) as GroupedMessages;
      state.isEmojiAdded = true;
      state.selectedReactions = action.payload.reactions;
    },
    SET_REPLIED_MESSAGE: (state, action) => {
      state.repliedMessage = action.payload;
    },
    SET_RIGHT_SIDEBAR_OPEN_STATUS: (state, action) => {
      state.isRightSidebarOpen = action.payload;
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
  SET_SELECTED_MESSAGE,
  SET_EMOJI_DETAILS_DIALOG_STATUS,
  SET_EMOJI_DETAILS_REACTIONS,
  REMOVE_EMOJI,
  SET_EDITED_MESSAGE,
  UPDATE_EDITED_MESSAGE,
  DELETE_MESSAGE,
  SET_REPLIED_MESSAGE,
  SET_RIGHT_SIDEBAR_OPEN_STATUS,
} = conversationSlice.actions;
export default conversationSlice.reducer;
