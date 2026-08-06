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
  const { messages = {} } = useSelector((state: RootState) => state?.message);
  const myId = loginUser?.id;
  const isOwn = sender_id === myId;
  const time = formatTimes(created_at);
  const seenTime = seen_at ? formatTimes(seen_at) : null;

  const userInfo = allUsers.find((user: TUser) => user.id === sender_id);

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
          <DoneAllIcon
            sx={{
              fontSize: 15,
              color: isOwn
                ? alpha(theme.palette.common.white, 0.95)
                : theme.palette.primary.main,
            }}
          />
        </Tooltip>
      );
    }

    return (
      <Tooltip title="Sent">
        <DoneIcon
          sx={{
            fontSize: 15,
            color: isOwn
              ? alpha(theme.palette.common.white, 0.6)
              : theme.palette.text.disabled,
          }}
        />
      </Tooltip>
    );
  };

  return (
    <Stack
      ref={containerRef}
      direction="row"
      justifyContent={isOwn ? "flex-end" : "flex-start"}
      alignItems="flex-end"
      spacing={1}
      sx={{
        width: "100%",
        position: "relative",
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
        alignItems="center"
        spacing={1}
        sx={{ maxWidth: { xs: "85%", sm: "70%" } }}
      >
        <Paper
          elevation={0}
          sx={{
            px: 2,
            py: 1.25,
            borderRadius: isOwn ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
            backgroundColor: isDeleted
              ? alpha(theme.palette.error.main, 0.06)
              : isOwn
                ? theme.palette.primary.main
                : theme.palette.background.paper,
            color:
              isOwn && !isDeleted
                ? theme.palette.primary.contrastText
                : theme.palette.text.primary,
            border: isDeleted
              ? `1px solid ${alpha(theme.palette.error.main, 0.3)}`
              : `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.04)}`,
            position: "relative",
            minWidth: 110,
          }}
        >
          {/* Replied Message Preview */}
          {replyId && (
            <Box
              sx={{
                borderLeft: `3px solid ${
                  isOwn
                    ? theme.palette.common.white
                    : theme.palette.primary.main
                }`,
                pl: 1.5,
                py: 0.5,
                mb: 1,
                borderRadius: 1,
                backgroundColor: isOwn
                  ? alpha(theme.palette.common.black, 0.15)
                  : alpha(theme.palette.action.hover, 0.08),
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 700,
                  display: "block",
                  color: isOwn
                    ? theme.palette.common.white
                    : theme.palette.primary.main,
                }}
              >
                {replyUser?.id === myId ? "You" : replyUser?.name || "User"}
              </Typography>
              <Typography
                variant="body2"
                noWrap
                sx={{
                  fontSize: "0.75rem",
                  opacity: 0.85,
                }}
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
                color: theme.palette.error.main,
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
            alignItems="center"
            justifyContent="flex-end"
            sx={{
              mt: 0.5,
              opacity: 0.85,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontSize: "0.68rem",
                color: "inherit",
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
                  color: isOwn
                    ? alpha(theme.palette.common.white, 0.9)
                    : theme.palette.primary.main,
                  ml: 0.5,
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
