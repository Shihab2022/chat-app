/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  Badge,
  InputBase,
  Paper,
  Stack,
  Tooltip,
  Button,
  Dialog,
  DialogContent,
  Popover,
  CircularProgress,
} from "@mui/material";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useTheme, alpha } from "@mui/material/styles";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import InsertEmoticonRoundedIcon from "@mui/icons-material/InsertEmoticonRounded";
import AttachFileRoundedIcon from "@mui/icons-material/AttachFileRounded";
import MicNoneRoundedIcon from "@mui/icons-material/MicNoneRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";

import { RootState } from "../../redux/store";
import {
  SET_CONVERSATION,
  SET_RECEIVER_ID,
  SET_RIGHT_SIDEBAR_OPEN_STATUS,
  SET_REAL_TIME_CONVERSATION,
  SET_REPLIED_MESSAGE,
  SET_EDITED_MESSAGE,
  UPDATE_EDITED_MESSAGE,
} from "../../redux/features/chat/conversationSlice";
import { CLEAR_UNREAD_FOR_PEER, UPDATE_PEER_LAST_MESSAGE, SET_ALL_USERS } from "../../redux/features/auth/authSlice";
import {
  SET_DISAPPEARING_MODAL_OPEN,
  SET_CONTACT_DETAIL_MODAL,
} from "../../redux/features/settings/settingsSlice";
import {
  sendMessage,
  sendGroupMessageAPI,
  getMessage,
  getGroupMessagesAPI,
  editMessage,
  replyMessageAPI,
  uploadMessageAttachmentAPI,
} from "../../services/message";
import { unblockUserAPI } from "../../services/auth";
import {
  PURPLE_PRIMARY,
  STATUS_ONLINE,
} from "../../theme";
import Message from "../messages/message";
import EmojiPicker from "../emoji";
import useDebouncedText from "../../utils/debouncedSearch";
import { groupMessagesByDate } from "../../utils/timeFormat";
import { showToast } from "../../utils/toast";
import { SUCCESS, FAILED } from "../../constants/common";
import { TUser } from "../../types";

export const ActiveChatView: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { receiverId, messages = {}, isRightSidebarOpen, editedMessage, repliedMessage } = useSelector(
    (state: RootState) => state.message
  );
  const { allUsers = [], activeUsers = [], loginUser } = useSelector(
    (state: RootState) => state.auth
  );
  const { wallpaperStyle, disappearingMessages } = useSelector(
    (state: RootState) => state.settings
  );

  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [emojiAnchorEl, setEmojiAnchorEl] = useState<HTMLElement | null>(null);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const { handleInputChange, message: inputMessage, stopTypingEvent } = useDebouncedText(receiverId);

  // Find active chat user / group
  const activeChat: TUser | undefined = useMemo(() => {
    return (allUsers || []).find((u: TUser) => String(u.id) === String(receiverId));
  }, [allUsers, receiverId]);

  const isOnline = activeChat?.isOnline || activeUsers.includes(String(activeChat?.id));
  const myId = loginUser?.id || "my-user";
  const isBlocked = !activeChat?.isGroup && Boolean(activeChat?.is_blocked || activeChat?.isBlocked);

  const handleUnblockActiveChat = async () => {
    if (!activeChat?.id) return;
    try {
      const res = await unblockUserAPI({ friendId: activeChat.id });
      if (res?.success) {
        showToast(SUCCESS, "Contact unblocked successfully!");
        dispatch(
          SET_ALL_USERS(
            allUsers.map((u: TUser) =>
              String(u.id) === String(activeChat.id)
                ? { ...u, is_blocked: false, isBlocked: false }
                : u
            )
          )
        );
      } else {
        showToast(FAILED, res?.message || "Failed to unblock");
      }
    } catch (err) {
      showToast(FAILED, "Failed to unblock contact");
    }
  };

  useEffect(() => {
    if (editedMessage?.id) {
      handleInputChange(editedMessage?.text || "");
    }
  }, [editedMessage?.id]);

  // Fetch real messages when receiverId changes
  useEffect(() => {
    if (receiverId && loginUser?.id) {
      const fetchHistory = async () => {
        setIsLoadingMessages(true);
        try {
          const res = activeChat?.isGroup
            ? await getGroupMessagesAPI({ groupId: receiverId })
            : await getMessage({ myId: loginUser.id, userToChatId: receiverId });
          if (res?.success && res.data) {
            dispatch(SET_CONVERSATION(groupMessagesByDate(res.data)));
            dispatch(CLEAR_UNREAD_FOR_PEER(receiverId));
          }
        } catch (e) {
          console.error("Failed to load message history:", e);
          showToast(FAILED, "Failed to load messages");
        } finally {
          setIsLoadingMessages(false);
        }
      };
      fetchHistory();
    }
  }, [receiverId, loginUser?.id, activeChat?.isGroup, dispatch]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, inputMessage]);


  const handleEditMessage = async () => {
    if (!editedMessage?.id || !inputMessage?.trim()) return;
    setIsSending(true);
    try {
      const res = await editMessage({
        ...editedMessage,
        id: editedMessage.id,
        text: inputMessage.trim(),
        receiverId,
      });
      if (res?.success) {
        dispatch(UPDATE_EDITED_MESSAGE(res.data));
        handleInputChange("");
        dispatch(SET_EDITED_MESSAGE({}));
      }
    } catch (err) {
      console.error("Error editing message:", err);
      showToast(FAILED, "Failed to edit message");
    } finally {
      setIsSending(false);
    }
  };

  const handleReplyMessage = async () => {
    if (!repliedMessage?.id || !inputMessage?.trim()) return;
    setIsSending(true);
    try {
      const res = await replyMessageAPI({
        sender_id: myId,
        receiverId,
        text: inputMessage.trim(),
        replyId: repliedMessage.id,
      });
      if (res?.success && Array.isArray(res.data)) {
        dispatch(SET_CONVERSATION(groupMessagesByDate(res.data)));
        const latest = res.data[res.data.length - 1];
        dispatch(UPDATE_PEER_LAST_MESSAGE({ peerId: receiverId, lastMessage: latest }));
        handleInputChange("");
        dispatch(SET_REPLIED_MESSAGE({}));
      }
    } catch (err) {
      console.error("Error replying to message:", err);
      showToast(FAILED, "Failed to send reply");
    } finally {
      setIsSending(false);
    }
  };

  const handleSendMessage = async () => {
    if (editedMessage?.id) {
      await handleEditMessage();
      return;
    }
    if (repliedMessage?.id) {
      await handleReplyMessage();
      return;
    }
    if (!inputMessage || !inputMessage.trim()) return;

    const textToSend = inputMessage.trim();
    handleInputChange("");
    stopTypingEvent();
    setIsSending(true);

    const tempMsg = {
      id: `local-${Date.now()}`,
      sender_id: myId,
      receiverId: receiverId,
      text: textToSend,
      created_at: new Date().toISOString(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      seen: false,
      pending: true,
    };

    dispatch(SET_REAL_TIME_CONVERSATION(tempMsg));

    try {
      if (activeChat?.isGroup) {
        const res = await sendGroupMessageAPI({ groupId: receiverId, text: textToSend });
        if (res?.success && res.data) {
          dispatch(SET_REAL_TIME_CONVERSATION({ ...res.data, pending: false }));
          dispatch(UPDATE_PEER_LAST_MESSAGE({ peerId: receiverId, lastMessage: res.data }));
        }
      } else {
        const res = await sendMessage({ sender_id: myId, receiverId, text: textToSend });
        if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
          dispatch(SET_CONVERSATION(groupMessagesByDate(res.data)));
          const latest = res.data[res.data.length - 1];
          dispatch(UPDATE_PEER_LAST_MESSAGE({ peerId: receiverId, lastMessage: latest }));
        }
      }
    } catch (err) {
      console.error("Error sending message:", err);
      showToast(FAILED, "Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const sendAttachmentMessage = async (uploadData: {
    url: string;
    fileName: string;
    fileType: string;
  }) => {
    const payload =
      uploadData.fileType === "image"
        ? { image: uploadData.url, text: "" }
        : {
            file_url: uploadData.url,
            file_name: uploadData.fileName,
            file_type: "pdf",
            text: "",
          };

    if (activeChat?.isGroup) {
      const res = await sendGroupMessageAPI({ groupId: receiverId, ...payload });
      if (res?.success && res.data) {
        dispatch(SET_REAL_TIME_CONVERSATION(res.data));
        dispatch(UPDATE_PEER_LAST_MESSAGE({ peerId: receiverId, lastMessage: res.data }));
      }
    } else {
      const res = await sendMessage({ sender_id: myId, receiverId, ...payload });
      if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
        dispatch(SET_CONVERSATION(groupMessagesByDate(res.data)));
        const latest = res.data[res.data.length - 1];
        dispatch(UPDATE_PEER_LAST_MESSAGE({ peerId: receiverId, lastMessage: latest }));
      }
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !receiverId) return;

    const isImage = file.type.startsWith("image/");
    const isPdf = file.type === "application/pdf";
    if (!isImage && !isPdf) {
      showToast(FAILED, "Only images and PDF files are supported");
      return;
    }

    setIsUploading(true);
    try {
      const uploadRes = await uploadMessageAttachmentAPI(file);
      if (!uploadRes?.success || !uploadRes.data?.url) {
        showToast(FAILED, uploadRes?.message || "Failed to upload file");
        return;
      }
      await sendAttachmentMessage(uploadRes.data);
      showToast(SUCCESS, isPdf ? "PDF sent" : "Photo sent");
    } catch (err) {
      console.error("Upload failed:", err);
      showToast(FAILED, "Failed to upload file");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const hasLoadedMessages = Object.keys(messages).length > 0;

  const disappearingLabel =
    disappearingMessages === "off"
      ? "Off"
      : disappearingMessages === "24h"
      ? "24 Hours"
      : disappearingMessages === "30d"
      ? "30 Days"
      : "7 Days";

  if (!activeChat) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
          ...wallpaperStyle,
        }}
      >
        <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
          Conversation not found.
        </Typography>
      </Box>
    );
  }


  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: theme.palette.background.default,
        overflow: "hidden",
      }}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*,application/pdf"
        style={{ display: "none" }}
      />

      {/* ── Chat Header matching PDF Page 2 ── */}
      <Box
        sx={{
          px: 2.5,
          py: 1.5,
          borderBottom: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.mode === "dark" ? theme.palette.background.paper : "#FFFFFF",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: 2,
        }}
      >
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", minWidth: 0 }}>
          <IconButton
            size="small"
            onClick={() => dispatch(SET_RECEIVER_ID(""))}
            sx={{ display: { xs: "flex", md: "none" }, color: theme.palette.text.secondary }}
          >
            <ArrowBackRoundedIcon />
          </IconButton>

          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            variant={isOnline ? "dot" : "standard"}
            sx={{
              flexShrink: 0,
              "& .MuiBadge-badge": {
                backgroundColor: STATUS_ONLINE,
                boxShadow: "0 0 0 2px #FFFFFF",
                width: 9,
                height: 9,
                borderRadius: "50%",
              },
            }}
          >
            <Avatar
              src={activeChat?.avatar || activeChat?.img}
              alt={activeChat?.name}
              sx={{
                width: 42,
                height: 42,
                fontSize: "0.9rem",
                fontWeight: 700,
                backgroundColor: alpha(PURPLE_PRIMARY, 0.15),
                color: PURPLE_PRIMARY,
              }}
            >
              {activeChat?.name?.[0]?.toUpperCase()}
            </Avatar>
          </Badge>

          <Box sx={{ minWidth: 0 }}>
            <Typography noWrap variant="subtitle1" sx={{ fontWeight: 700, fontSize: "0.95rem", lineHeight: 1.2 }}>
              {activeChat.name}
            </Typography>

            <Typography
              variant="caption"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: "0.75rem",
                display: "inline-flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              {isOnline ? "Online" : "Offline"}
              {disappearingMessages !== "off" && (
                <>
                  <AccessTimeRoundedIcon sx={{ fontSize: 13, color: theme.palette.text.secondary, ml: 0.5 }} />
                  <span>{disappearingLabel}</span>
                </>
              )}
            </Typography>
          </Box>
        </Stack>

        {/* Right Header Action Icons */}
        <Stack direction="row" spacing={0.75} sx={{ alignItems: "center" }}>
          <Tooltip title="Search in Chat" arrow>
            <IconButton size="small" sx={{ color: theme.palette.text.secondary }}>
              <SearchRoundedIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Audio Call" arrow>
            <IconButton size="small" sx={{ color: theme.palette.text.secondary }}>
              <LocalPhoneOutlinedIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Video Call" arrow>
            <IconButton size="small" sx={{ color: theme.palette.text.secondary }}>
              <VideocamOutlinedIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Contact Details" arrow>
            <IconButton
              size="small"
              onClick={() => dispatch(SET_CONTACT_DETAIL_MODAL({ open: true, contact: activeChat }))}
              sx={{ color: theme.palette.text.secondary }}
            >
              <InfoOutlinedIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Tooltip>

          <IconButton
            size="small"
            onClick={() => dispatch(SET_RIGHT_SIDEBAR_OPEN_STATUS(!isRightSidebarOpen))}
            sx={{ color: theme.palette.text.secondary }}
          >
            <MoreVertRoundedIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Stack>
      </Box>

      {/* ── Disappearing Messages Banner matching PDF Page 2 ── */}
      {disappearingMessages !== "off" && (
        <Box
          sx={{
            px: 2.5,
            py: 1,
            backgroundColor: theme.palette.mode === "dark" ? alpha(PURPLE_PRIMARY, 0.1) : alpha(PURPLE_PRIMARY, 0.04),
            borderBottom: `1px solid ${theme.palette.divider}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
            <AccessTimeRoundedIcon sx={{ color: PURPLE_PRIMARY, fontSize: 18 }} />
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 700, fontSize: "0.78rem", color: theme.palette.text.primary, display: "block" }}>
                Disappearing Messages Enabled
              </Typography>
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontSize: "0.72rem" }}>
                Messages disappear after {disappearingLabel}.
              </Typography>
            </Box>
          </Box>

          <Button
            size="small"
            variant="outlined"
            onClick={() => dispatch(SET_DISAPPEARING_MODAL_OPEN(true))}
            sx={{
              borderColor: PURPLE_PRIMARY,
              color: PURPLE_PRIMARY,
              fontSize: "0.72rem",
              fontWeight: 600,
              py: 0.35,
              px: 1.25,
              borderRadius: "6px",
              "&:hover": {
                borderColor: "#6D28D9",
                backgroundColor: alpha(PURPLE_PRIMARY, 0.08),
              },
            }}
          >
            Change
          </Button>
        </Box>
      )}

      {/* ── Blocked Contact Banner ── */}
      {isBlocked && (
        <Box
          sx={{
            px: 2.5,
            py: 1.25,
            backgroundColor: alpha(theme.palette.error.main, 0.08),
            borderBottom: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="body2" sx={{ color: "error.main", fontWeight: 600, fontSize: "0.825rem" }}>
            🚫 You have blocked this contact. Unblock to send and receive messages.
          </Typography>
          <Button
            size="small"
            variant="contained"
            color="success"
            onClick={handleUnblockActiveChat}
            sx={{ fontSize: "0.72rem", py: 0.35, px: 1.5, borderRadius: "6px" }}
          >
            Unblock
          </Button>
        </Box>
      )}

      {/* ── Scrollable Messages Stream with Wallpaper ── */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          p: { xs: 1.5, sm: 2.5 },
          display: "flex",
          flexDirection: "column",
          gap: 2,
          minWidth: 0,
          ...wallpaperStyle,
        }}
      >
        {!hasLoadedMessages && isLoadingMessages ? (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              py: 8,
            }}
          >
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
              Loading messages...
            </Typography>
          </Box>
        ) : !hasLoadedMessages ? (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              py: 8,
              px: 3,
              textAlign: "center",
            }}
          >
            <Box
              sx={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                backgroundColor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "#F3F4F6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <ChatBubbleOutlineRoundedIcon sx={{ fontSize: 32, color: theme.palette.text.secondary }} />
            </Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
              No messages yet
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, maxWidth: 280 }}>
              Send a message to start the conversation with {activeChat.name}.
            </Typography>
          </Box>
        ) : (
          <Message />
        )}

        <div ref={messagesEndRef} />
      </Box>

      {/* ── Bottom Message Input matching PDF Page 2 ── */}
      <Box
        sx={{
          p: 1.5,
          px: { xs: 1.5, sm: 2.5 },
          borderTop: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.mode === "dark" ? theme.palette.background.paper : "#FFFFFF",
          position: "relative",
        }}
      >
        {/* Reply / Edit preview */}
        {Object.keys(repliedMessage || {}).length > 0 && (
          <Box
            sx={{
              mb: 1,
              px: 1.5,
              py: 1,
              borderRadius: "8px",
              backgroundColor: alpha(PURPLE_PRIMARY, 0.06),
              borderLeft: `3px solid ${PURPLE_PRIMARY}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1,
            }}
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: PURPLE_PRIMARY, display: "block" }}>
                Replying to message
              </Typography>
              <Typography variant="body2" noWrap sx={{ color: theme.palette.text.secondary }}>
                {repliedMessage?.text || (repliedMessage?.image ? "Photo" : repliedMessage?.file ? "PDF" : "Message")}
              </Typography>
            </Box>
            <IconButton size="small" onClick={() => dispatch(SET_REPLIED_MESSAGE({}))}>
              <CloseRoundedIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>
        )}

        {editedMessage?.id && (
          <Box
            sx={{
              mb: 1,
              px: 1.5,
              py: 1,
              borderRadius: "8px",
              backgroundColor: alpha(PURPLE_PRIMARY, 0.06),
              borderLeft: `3px solid ${PURPLE_PRIMARY}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1,
            }}
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: PURPLE_PRIMARY, display: "block" }}>
                Editing message
              </Typography>
              <Typography variant="body2" noWrap sx={{ color: theme.palette.text.secondary }}>
                {editedMessage?.text}
              </Typography>
            </Box>
            <IconButton
              size="small"
              onClick={() => {
                dispatch(SET_EDITED_MESSAGE({}));
                handleInputChange("");
              }}
            >
              <CloseRoundedIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>
        )}

        <Popover
          open={Boolean(emojiAnchorEl)}
          anchorEl={emojiAnchorEl}
          onClose={() => setEmojiAnchorEl(null)}
          anchorOrigin={{ vertical: "top", horizontal: "left" }}
          transformOrigin={{ vertical: "bottom", horizontal: "left" }}
        >
          <Box sx={{ p: 0.5 }}>
            <Picker
              data={data}
              onEmojiSelect={(emoji: { native: string }) => {
                handleInputChange(`${inputMessage || ""}${emoji.native}`);
                setEmojiAnchorEl(null);
              }}
              previewPosition="none"
            />
          </Box>
        </Popover>

        <Paper
          elevation={0}
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            if (!isBlocked) {
              handleSendMessage();
            }
          }}
          sx={{
            display: "flex",
            alignItems: "center",
            px: 1.25,
            py: 0.5,
            borderRadius: "10px",
            backgroundColor: isBlocked
              ? theme.palette.mode === "dark" ? alpha("#FFFFFF", 0.02) : "#F3F4F6"
              : theme.palette.mode === "dark" ? alpha("#FFFFFF", 0.04) : "#F8F9FB",
            border: `1px solid ${theme.palette.divider}`,
            opacity: isBlocked ? 0.7 : 1,
            "&:focus-within": {
              borderColor: isBlocked ? theme.palette.divider : PURPLE_PRIMARY,
              boxShadow: isBlocked ? "none" : `0 0 0 2px ${alpha(PURPLE_PRIMARY, 0.15)}`,
            },
          }}
        >
          {/* Audio recording / mic icon */}
          <IconButton size="small" disabled={isBlocked} sx={{ color: theme.palette.text.secondary }}>
            <MicNoneRoundedIcon sx={{ fontSize: 20 }} />
          </IconButton>

          {/* Emoji button */}
          <IconButton
            size="small"
            disabled={isBlocked}
            onClick={(e) => setEmojiAnchorEl(e.currentTarget)}
            sx={{ color: emojiAnchorEl ? PURPLE_PRIMARY : theme.palette.text.secondary }}
          >
            <InsertEmoticonRoundedIcon sx={{ fontSize: 20 }} />
          </IconButton>

          {/* Text input with placeholder "Type Your Message" */}
          <InputBase
            fullWidth
            disabled={isBlocked}
            placeholder={isBlocked ? "Unblock contact to send message" : "Type Your Message"}
            value={inputMessage}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !isBlocked) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            sx={{
              ml: 1,
              mr: 1,
              fontSize: "0.85rem",
              color: theme.palette.text.primary,
            }}
          />

          {/* Attachment button */}
          <IconButton
            size="small"
            onClick={() => fileInputRef.current?.click()}
            disabled={isBlocked || isUploading}
            sx={{ color: theme.palette.text.secondary }}
          >
            {isUploading ? (
              <CircularProgress size={18} />
            ) : (
              <AttachFileRoundedIcon sx={{ fontSize: 20, transform: "rotate(45deg)" }} />
            )}
          </IconButton>

          <IconButton
            size="small"
            onClick={handleSendMessage}
            disabled={isBlocked || !inputMessage?.trim() || isSending || isUploading}
            sx={{
              backgroundColor: PURPLE_PRIMARY,
              color: "#FFFFFF",
              borderRadius: "8px",
              width: 34,
              height: 34,
              ml: 0.5,
              "&:hover": { backgroundColor: "#6D28D9" },
              "&.Mui-disabled": {
                backgroundColor: alpha(PURPLE_PRIMARY, 0.4),
                color: alpha("#FFFFFF", 0.7),
              },
            }}
          >
            <SendRoundedIcon sx={{ fontSize: 17 }} />
          </IconButton>
        </Paper>

        <EmojiPicker />
      </Box>

      {/* Lightbox Modal */}
      <Dialog
        open={Boolean(lightboxImg)}
        onClose={() => setLightboxImg(null)}
        maxWidth="md"
        slotProps={{
          paper: { sx: { backgroundColor: "transparent", boxShadow: "none", p: 0 } },
        }}
      >
        <DialogContent sx={{ p: 0, textAlign: "center" }}>
          {lightboxImg && (
            <Box
              component="img"
              src={lightboxImg}
              alt="Preview"
              sx={{
                maxWidth: "90vw",
                maxHeight: "85vh",
                borderRadius: "12px",
                boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ActiveChatView;
