import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Box, Paper, Stack, Typography, Tooltip } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import DoneIcon from "@mui/icons-material/Done";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

import { RootState } from "../../redux/store";
import { TMessage, TUser } from "../../types";
import { formatTimes } from "../../utils/timeFormat";
import { CHATTY_INCOMING_BUBBLE, CHATTY_OUTGOING_BUBBLE } from "../../theme";
import MessageIcons from "./messageIcons";
import ShowingEmoji from "./showingEmoji";
import { ImgViewer } from "../imgViewer";
import { emitMessageSeen } from "../../utils/socketService";

interface ShowingMessageProps {
  mess: TMessage;
  messageEndRef: React.RefObject<HTMLDivElement>;
}

const ShowingMessage = ({ mess, messageEndRef }: ShowingMessageProps) => {
  const theme = useTheme();
  const {
    text,
    sender_id,
    created_at,
    isDeleted,
    replyId,
    seen,
    seen_at,
    pending,
  } = mess;

  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { loginUser, allUsers } = useSelector(
    (state: RootState) => state?.auth,
  );
  const { messages = {}, receiverId } = useSelector((state: RootState) => state?.message);
  const myId = loginUser?.id;
  const isOwn = sender_id === myId;
  const time = formatTimes(created_at);
  const seenTime = seen_at ? formatTimes(seen_at) : null;

  const userInfo = allUsers.find((user: TUser) => user.id === sender_id);
  const activeChat = allUsers.find((u: TUser) => String(u.id) === String(receiverId));
  const isGroupChat = !!activeChat?.isGroup;
  const senderName = isGroupChat && !isOwn ? userInfo?.name || "Unknown" : "";

  // Find replied message details
  const repliedMessage = replyId
    ? (Object.values(messages) as TMessage[][])
        .flat()
        .find((m) => m.id === replyId)
    : undefined;

  const replyUser = repliedMessage
    ? allUsers.find((user: TUser) => user.id === repliedMessage.sender_id)
    : undefined;

  // -------------------------------------------------------------
  // Automatic Seen Observer: Emits when an unread message is visible
  // -------------------------------------------------------------
  useEffect(() => {
    if (isOwn || seen || !containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (mess.sender_id && mess.id && mess.seen === false) {
              emitMessageSeen(mess.sender_id, mess.id);
            }
            observer.disconnect();
          }
        });
      },
      { threshold: 0.6 },
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [isOwn, seen, mess]);

  // Render checkmark / status icon for outgoing messages
  const renderStatusIcon = () => {
    if (!isOwn) return null;

    if (pending) {
      return (
        <Tooltip title="Sending...">
          <AccessTimeIcon
            sx={{ fontSize: 13, color: theme.palette.text.disabled }}
          />
        </Tooltip>
      );
    }

    if (seen) {
      return (
        <Tooltip title={seenTime ? `Read at ${seenTime}` : "Seen"}>
          <DoneAllIcon sx={{ fontSize: 15, color: theme.palette.primary.main }} />
        </Tooltip>
      );
    }

    return (
      <Tooltip title="Sent">
        <DoneIcon sx={{ fontSize: 15, color: theme.palette.text.disabled }} />
      </Tooltip>
    );
  };

  const bubbleBackground = isDeleted
    ? "transparent"
    : isOwn
    ? CHATTY_OUTGOING_BUBBLE
    : CHATTY_INCOMING_BUBBLE;
  const bubbleBorder = isDeleted
    ? `1px dashed ${alpha(theme.palette.error.main, 0.4)}`
    : isOwn
    ? "none"
    : `1px solid ${alpha(theme.palette.common.black, 0.06)}`;
  const bubbleRadius = isOwn ? "18px 4px 18px 18px" : "4px 18px 18px 18px";

  return (
    <Stack
      ref={containerRef}
      direction="row"
      spacing={1}
      sx={{
        width: "100%",
        position: "relative",
        justifyContent: isOwn ? "flex-end" : "flex-start",
        alignItems: "flex-end",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div ref={messageEndRef} />

      {/* Avatar for incoming messages */}
      {!isOwn && (
        <Box sx={{ mb: 0.5 }}>
          <ImgViewer
            img={userInfo?.img}
            tooltipText={userInfo?.name || "User"}
          />
        </Box>
      )}

      {/* Main Message Block */}
      <Stack
        direction={isOwn ? "row-reverse" : "row"}
        spacing={1}
        sx={{ maxWidth: { xs: "85%", sm: "70%", alignItems: "center" } }}
      >
        <Paper
          elevation={0}
          className="animate-msg-in"
          sx={{
            px: 1.75,
            py: 1,
            borderRadius: bubbleRadius,
            backgroundColor: bubbleBackground,
            color: theme.palette.text.primary,
            border: bubbleBorder,
            boxShadow: `0 1px 4px ${alpha(theme.palette.common.black, 0.06)}`,
            position: "relative",
            minWidth: 100,
            maxWidth: "100%",
            wordBreak: "break-word",
          }}
        >
          {/* Sender name for group chats */}
          {senderName && (
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                display: "block",
                mb: 0.25,
                color: theme.palette.primary.main,
              }}
            >
              {senderName}
            </Typography>
          )}

          {/* Replied Message Preview */}
          {replyId && (
            <Box
              sx={{
                borderLeft: `3px solid ${theme.palette.primary.main}`,
                pl: 1.5,
                py: 0.5,
                mb: 1,
                borderRadius: 1,
                backgroundColor: isOwn
                  ? alpha(theme.palette.primary.main, 0.12)
                  : alpha(theme.palette.action.hover, 0.08),
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 700,
                  display: "block",
                  color: theme.palette.primary.main,
                }}
              >
                {replyUser?.id === myId ? "You" : replyUser?.name || "User"}
              </Typography>
              <Typography
                variant="body2"
                noWrap
                sx={{ fontSize: "0.75rem", color: theme.palette.text.secondary }}
              >
                {repliedMessage?.text || "Original message"}
              </Typography>
            </Box>
          )}

          {/* Text Content */}
          {isDeleted ? (
            <Typography
              variant="body2"
              sx={{
                fontStyle: "italic",
                color: theme.palette.text.secondary,
              }}
            >
              This message was deleted
            </Typography>
          ) : (
            <Typography
              variant="body1"
              sx={{
                fontSize: "0.95rem",
                lineHeight: 1.4,
                wordBreak: "break-word",
              }}
            >
              {text}
            </Typography>
          )}

          {/* Footer: Time & Read Status Text Indicator */}
          <Stack
            direction="row"
            spacing={0.5}
            sx={{
              mt: 0.5,
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontSize: "0.68rem",
                color: theme.palette.text.secondary,
              }}
            >
              {time}
            </Typography>

            {/* Text Label Indicator for Seen Status */}
            {isOwn && seen && !isDeleted && (
              <Typography
                variant="caption"
                sx={{
                  fontSize: "0.65rem",
                  fontWeight: 600,
                  color: theme.palette.primary.main,
                  ml: 0.25,
                }}
              >
                • {seenTime ? `Read at ${seenTime}` : "Seen"}
              </Typography>
            )}

            {/* Checkmark Icon */}
            {!isDeleted && renderStatusIcon()}
          </Stack>

          {/* Reactions Badge */}
          {mess?.reactions && mess.reactions.length > 0 && !isDeleted && (
            <ShowingEmoji mess={mess} myId={myId} />
          )}
        </Paper>

        {/* Hover Action Icons */}
        {isHovered && !isDeleted && <MessageIcons mess={mess} myId={myId} />}
      </Stack>
    </Stack>
  );
};

export default ShowingMessage;
