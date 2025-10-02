/* eslint-disable @typescript-eslint/no-explicit-any */
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import SendIcon from "@mui/icons-material/Send";
import { showToast } from "../utils/toast";
import { COMMON_ERROR_MESSAGE, FAILED } from "../constants/common";
import { editMessage, replyMessageAPI, sendMessage } from "../services/message";
import { useDispatch, useSelector } from "react-redux";
import {
  SET_CONVERSATION,
  SET_EMOJI_ANCHOR_EL,
  SET_EMOJI_STATUS,
  SET_ONE_ICON,
  SET_REPLIED_MESSAGE,
  UPDATE_EDITED_MESSAGE,
} from "../redux/features/chat/conversationSlice";
import { RootState } from "../redux/store";
import { groupMessagesByDate } from "../utils/timeFormat";
import EmojiPicker from "./emoji";
import useDebouncedText from "../utils/debouncedSearch";
import { useEffect } from "react";
import { Box, Stack, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { SET_ALL_USERS } from "../redux/features/auth/authSlice";
export default function SearchField({ myId }: { myId: string }) {
  const dispatch = useDispatch();
  const { receiverId, isEmojiOpen, editedMessage, repliedMessage, messages } =
    useSelector((state: RootState) => state?.message);
  const { allUsers } = useSelector((state: RootState) => state?.auth);
  const { handleInputChange, message, stopTypingEvent } =
    useDebouncedText(receiverId);

  const updateSideBarLastMessage = (msg: any) => {
    const updatedLastMessage = allUsers?.map((user: any) => {
      if (user?._id === msg?.receiverId || user?._id === msg?.senderId) {
        return { ...user, lastMessage: msg };
      } else {
        return user;
      }
    });

    dispatch(SET_ALL_USERS(updatedLastMessage));
  };
  const handleClick = async () => {
    const messageData = {
      senderId: myId,
      receiverId: receiverId,
      text: message,
    };

    try {
      const res = await sendMessage(messageData);
      if (res?.success) {
        handleInputChange("");
        stopTypingEvent();

        updateSideBarLastMessage({
          ...messageData,
          createdAt: new Date().toISOString(),
        });
        const formattedMessage = groupMessagesByDate(res?.data);
        dispatch(SET_CONVERSATION(formattedMessage));
      }
    } catch (error) {
      console.log({ error });
      showToast(FAILED, COMMON_ERROR_MESSAGE);
    }
  };

  useEffect(() => {
    if (editedMessage?._id) {
      handleInputChange(editedMessage?.text);
    } else {
      handleInputChange("");
    }
  }, [editedMessage, messages]);
  const handleEditMessage = async () => {
    try {
      const params = { ...editedMessage, text: message };
      const res = await editMessage(params);
      if (res?.success) {
        dispatch(UPDATE_EDITED_MESSAGE(res?.data));
        handleInputChange("");
      }
    } catch (error) {
      console.log({ error });
    }
  };
  const handleReplyMessage = async () => {
    try {
      if (message?.length === 0) return;
      const messageData = {
        senderId: myId,
        receiverId: receiverId,
        text: message,
        replyId: repliedMessage?._id,
      };
      const res = await replyMessageAPI(messageData);
      if (res?.success) {
        handleInputChange("");
        stopTypingEvent();
        updateSideBarLastMessage({
          ...messageData,
          createdAt: new Date().toISOString(),
        });
        const formattedMessage = groupMessagesByDate(res?.data);
        dispatch(SET_CONVERSATION(formattedMessage));
        dispatch(SET_REPLIED_MESSAGE({}));
      }
    } catch (error) {
      console.log({ error });
    }
  };
  const handleSubmit = async () => {
    if (editedMessage?._id) {
      handleEditMessage();
    } else if (repliedMessage?._id) {
      handleReplyMessage();
    } else {
      handleClick();
    }
  };
  return (
    <>
      <Paper
        component="form"
        sx={{
          p: "2px 0px",
          border: "1px solid gray",
        }}
      >
        {Object.keys(repliedMessage)?.length > 0 && (
          <Stack
            direction="row"
            spacing={2}
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
              background: "#d1f5d6ff",
              paddingX: "15px",
              marginX: " 10px",
              borderRadius: "10px",
            }}
          >
            <Box sx={{ py: 1 }}>
              {/* <Typography variant="h6" sx={{ fontWeight: "200" }}>
                {editedMessage?._id ? "editedMessage?" : "repliedMessage?"}
              </Typography> */}
              <Typography variant="subtitle1">
                {repliedMessage?.text?.length > 50
                  ? repliedMessage?.text?.substring(0, 50) + "..."
                  : repliedMessage?.text}
              </Typography>
            </Box>
            <CloseIcon
              onClick={() => dispatch(SET_REPLIED_MESSAGE({}))}
              sx={{ cursor: "pointer" }}
            />
          </Stack>
        )}

        <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
          <IconButton
            onClick={(e) => {
              dispatch(SET_EMOJI_ANCHOR_EL(e.currentTarget));
              dispatch(SET_EMOJI_STATUS(!isEmojiOpen));
              dispatch(SET_ONE_ICON(false));
            }}
            sx={{ p: "10px" }}
            aria-label="menu"
          >
            <AddIcon />
          </IconButton>
          <InputBase
            onChange={(e: any) => {
              handleInputChange(e.target.value);
            }}
            value={message}
            sx={{ ml: 1, flex: 1 }}
            placeholder="Type a message"
            inputProps={{ "aria-label": "search google maps" }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (message) {
                  handleSubmit();
                }
              }
            }}
          />
          <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
          <IconButton
            onClick={handleSubmit}
            color="primary"
            sx={{ p: "10px" }}
            aria-label="directions"
            disabled={!message}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Paper>

      <EmojiPicker
        onEmojiChanges={(e: any) => handleInputChange((prev: any) => prev + e)}
      />
    </>
  );
}
