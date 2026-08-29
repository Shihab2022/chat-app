import { useEffect, KeyboardEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { alpha, useTheme } from "@mui/material/styles";
import { showToast } from "../utils/toast";
import { COMMON_ERROR_MESSAGE, FAILED } from "../constants/common";
import {
  editMessage,
  getGroupMessagesAPI,
  replyMessageAPI,
  sendGroupMessageAPI,
  sendMessage,
} from "../services/message";
import {
  SET_CONVERSATION,
  SET_EMOJI_ANCHOR_EL,
  SET_EMOJI_STATUS,
  SET_ONE_ICON,
  SET_REPLIED_MESSAGE,
  UPDATE_EDITED_MESSAGE,
} from "../redux/features/chat/conversationSlice";
import { RootState } from "../redux/store";
import { TUser } from "../types";
import { groupMessagesByDate } from "../utils/timeFormat";
import EmojiPicker from "./emoji";
import useDebouncedText from "../utils/debouncedSearch";
import { SET_ALL_USERS } from "../redux/features/auth/authSlice";

interface SearchFieldProps {
  myId: string;
}

export default function SearchField({ myId }: SearchFieldProps) {
  const theme = useTheme();
  const dispatch = useDispatch();

  const { receiverId, isEmojiOpen, editedMessage, repliedMessage, messages } =
    useSelector((state: RootState) => state?.message);
  const { allUsers } = useSelector((state: RootState) => state?.auth);
  const activeChat = allUsers.find(
    (user: TUser) => String(user.id) === String(receiverId),
  );
  const { handleInputChange, message, stopTypingEvent } =
    useDebouncedText(receiverId);

  const updateSideBarLastMessage = (msg: Record<string, unknown>) => {
    const updatedLastMessage = allUsers?.map(
      (user: Record<string, unknown>) => {
        if (user?.id === msg?.receiverId || user?.id === msg?.sender_id) {
          return { ...user, lastMessage: msg };
        }
        return user;
      },
    );

    dispatch(SET_ALL_USERS(updatedLastMessage));
  };

  const handleClick = async () => {
    const messageData = {
      sender_id: myId,
      receiverId: receiverId,
      text: message,
    };

    try {
      const res = activeChat?.isGroup
        ? await sendGroupMessageAPI({
            groupId: receiverId,
            text: message,
          })
        : await sendMessage(messageData);
      if (res?.success) {
        handleInputChange("");
        stopTypingEvent();

        updateSideBarLastMessage({
          ...messageData,
          created_at: new Date().toISOString(),
        });
        const groupMessages = activeChat?.isGroup
          ? await getGroupMessagesAPI({ groupId: receiverId })
          : res;
        const formattedMessage = groupMessagesByDate(groupMessages?.data || []);
        dispatch(SET_CONVERSATION(formattedMessage));
      }
    } catch (error) {
      console.error("Send message failed:", error);
      showToast(FAILED, COMMON_ERROR_MESSAGE);
    }
  };

  useEffect(() => {
    if (editedMessage?.id) {
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
      console.error("Edit message failed:", error);
    }
  };

  const handleReplyMessage = async () => {
    try {
      if (!message || message.trim().length === 0) return;
      const messageData = {
        sender_id: myId,
        receiverId: receiverId,
        text: message,
        replyId: repliedMessage?.id,
      };
      const res = await replyMessageAPI(messageData);
      if (res?.success) {
        handleInputChange("");
        stopTypingEvent();
        updateSideBarLastMessage({
          ...messageData,
          created_at: new Date().toISOString(),
        });
        const formattedMessage = groupMessagesByDate(res?.data);
        dispatch(SET_CONVERSATION(formattedMessage));
        dispatch(SET_REPLIED_MESSAGE({}));
      }
    } catch (error) {
      console.error("Reply message failed:", error);
    }
  };

  const handleSubmit = async () => {
    if (editedMessage?.id) {
      handleEditMessage();
    } else if (repliedMessage?.id) {
      handleReplyMessage();
    } else {
      handleClick();
    }
  };

  return (
    <>
      <Paper
        elevation={0}
        component="form"
        onSubmit={(e) => e.preventDefault()}
        sx={{
          p: "4px 8px",
          borderRadius: 3,
          border: `1px solid ${theme.palette.divider}`,
          backgroundColor: alpha(theme.palette.background.paper, 0.9),
          backdropFilter: "blur(12px)",
          boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.05)}`,
        }}
      >
        {/* Reply Indicator Bar */}
        {Object.keys(repliedMessage || {})?.length > 0 && (
          <Stack
            direction="row"
            spacing={2}
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: alpha(theme.palette.primary.main, 0.08),
              px: 2,
              py: 1,
              mb: 1,
              borderRadius: 2,
              borderLeft: `4px solid ${theme.palette.primary.main}`,
            }}
          >
            <Box sx={{ overflow: "hidden" }}>
              <Typography
                variant="caption"
                sx={{ color: theme.palette.primary.main, fontWeight: 600 }}
              >
                Replying to message
              </Typography>
              <Typography
                variant="body2"
                noWrap
                sx={{ color: theme.palette.text.secondary }}
              >
                {repliedMessage?.text?.length > 50
                  ? repliedMessage?.text?.substring(0, 50) + "..."
                  : repliedMessage?.text}
              </Typography>
            </Box>
            <IconButton
              size="small"
              onClick={() => dispatch(SET_REPLIED_MESSAGE({}))}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Stack>
        )}

        <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
          <IconButton
            onClick={(e) => {
              dispatch(SET_EMOJI_ANCHOR_EL(e.currentTarget));
              dispatch(SET_EMOJI_STATUS(!isEmojiOpen));
              dispatch(SET_ONE_ICON(false));
            }}
            sx={{ p: "10px", color: theme.palette.text.secondary }}
            aria-label="add attachment or emoji"
          >
            <AddIcon />
          </IconButton>

          <InputBase
            onChange={(e) => handleInputChange(e.target.value)}
            value={message}
            sx={{ ml: 1, flex: 1, fontSize: "0.95rem" }}
            placeholder="Type a message..."
            inputProps={{ "aria-label": "type a message" }}
            onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (message) {
                  handleSubmit();
                }
              }
            }}
          />

          <Divider
            sx={{ height: 28, m: 0.5, borderColor: theme.palette.divider }}
            orientation="vertical"
          />

          <IconButton
            onClick={handleSubmit}
            color="primary"
            sx={{ p: "10px" }}
            aria-label="send message"
            disabled={!message}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Paper>

      <EmojiPicker
        onEmojiChanges={(e: string) =>
          handleInputChange((prev: string) => prev + e)
        }
      />
    </>
  );
}
