/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Paper,
  Stack,
  Typography,
  Tooltip,
  Link,
  Dialog,
  DialogContent,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import DoneIcon from "@mui/icons-material/Done";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
import FileDownloadRoundedIcon from "@mui/icons-material/FileDownloadRounded";

import { RootState } from "../../redux/store";
import { TMessage, TUser } from "../../types";
import { formatTimes } from "../../utils/timeFormat";
import { PURPLE_PRIMARY } from "../../theme";
import MessageIcons from "./messageIcons";
import ShowingEmoji from "./showingEmoji";
import { ImgViewer } from "../imgViewer";
import { emitMessageSeen } from "../../utils/socketService";

interface ShowingMessageProps {
  mess: TMessage;
  messageEndRef: React.RefObject<HTMLDivElement>;
}

// Cross-origin safe download that preserves the original file name and format
const downloadFile = async (url: string, fileName: string) => {
  try {
    const res = await fetch(url, { mode: "cors" });
    if (!res.ok) throw new Error("Download failed");
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(blobUrl);
  } catch {
    // CORS or network failure fallback: open in a new tab
    window.open(url, "_blank", "noopener,noreferrer");
  }
};

export const ShowingMessage = ({ mess, messageEndRef }: ShowingMessageProps) => {
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
    image,
    file,
    fileName,
  } = mess;

  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const resolvedReplyId = replyId || (mess as any).reply_id;

  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { loginUser, allUsers = [] } = useSelector((state: RootState) => state?.auth);
  const { messages = {}, receiverId } = useSelector((state: RootState) => state?.message);
  const myId = String(loginUser?.id || "");
  const isOwn = String(sender_id) === myId;
  const time = formatTimes(created_at);
  const seenTime = seen_at ? formatTimes(seen_at) : null;

  const userInfo = allUsers.find((user: TUser) => String(user.id) === String(sender_id));
  const activeChat = allUsers.find((u: TUser) => String(u.id) === String(receiverId));
  const isGroupChat = !!activeChat?.isGroup;
  const senderName = isGroupChat && !isOwn ? userInfo?.name || "Member" : "";

  // Replied message details
  const repliedMessage = resolvedReplyId
    ? (Object.values(messages) as TMessage[][])
        .flat()
        .find((m) => String(m.id) === String(resolvedReplyId))
    : undefined;

  const replyUser = repliedMessage
    ? allUsers.find((user: TUser) => String(user.id) === String(repliedMessage.sender_id))
    : undefined;

  // Automatic seen observer
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
      { threshold: 0.6 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [isOwn, seen, mess]);

  const renderStatusIcon = () => {
    if (!isOwn) return null;

    if (pending) {
      return (
        <Tooltip title="Sending...">
          <AccessTimeIcon sx={{ fontSize: 13, color: alpha("#FFFFFF", 0.7) }} />
        </Tooltip>
      );
    }

    if (seen) {
      return (
        <Tooltip title={seenTime ? `Read at ${seenTime}` : "Seen"}>
          <DoneAllIcon sx={{ fontSize: 14, color: "#93C5FD" }} />
        </Tooltip>
      );
    }

    return (
      <Tooltip title="Sent">
        <DoneIcon sx={{ fontSize: 14, color: alpha("#FFFFFF", 0.75) }} />
      </Tooltip>
    );
  };

  const isDarkMode = theme.palette.mode === "dark";

  // Bubble colors
  const outgoingBg = `linear-gradient(135deg, ${PURPLE_PRIMARY} 0%, #6366F1 100%)`;
  const incomingBg = isDarkMode ? alpha("#FFFFFF", 0.08) : "#F3F4F6";

  const bubbleBackground = isDeleted
    ? "transparent"
    : isOwn
    ? outgoingBg
    : incomingBg;

  const bubbleBorder = isDeleted
    ? `1px dashed ${alpha(theme.palette.error.main, 0.4)}`
    : isOwn
    ? "none"
    : `1px solid ${isDarkMode ? alpha("#FFFFFF", 0.08) : "#E5E7EB"}`;

  const bubbleRadius = isOwn ? "16px 16px 4px 16px" : "16px 16px 16px 4px";
  const hasReactions = mess?.reactions && mess.reactions.length > 0;

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
        mb: hasReactions ? 1.75 : 0.5,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div ref={messageEndRef} />

      {/* Avatar for incoming messages */}
      {!isOwn && (
        <Box sx={{ mb: 0.25, flexShrink: 0 }}>
          <ImgViewer
            img={userInfo?.img || userInfo?.avatar}
            tooltipText={userInfo?.name || "User"}
          />
        </Box>
      )}

      {/* Main Message Block */}
      <Stack
        direction={isOwn ? "row-reverse" : "row"}
        spacing={0.75}
        sx={{
          maxWidth: { xs: "88%", sm: "75%", md: "68%" },
          alignItems: "flex-end",
          minWidth: 0,
        }}
      >
        <Paper
          elevation={0}
          className="animate-msg-in"
          sx={{
            px: 1.75,
            py: 1,
            borderRadius: bubbleRadius,
            background: bubbleBackground,
            color: isOwn ? "#FFFFFF" : theme.palette.text.primary,
            border: bubbleBorder,
            boxShadow: isOwn
              ? "0 2px 8px rgba(124, 58, 237, 0.25)"
              : "0 1px 3px rgba(0,0,0,0.05)",
            position: "relative",
            minWidth: 64,
            maxWidth: "100%",
            overflow: "visible", // Ensures reactions pill is never cut off
            transition: "all 150ms ease",
          }}
        >
          {/* Group Sender Name */}
          {senderName && (
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                fontSize: "0.75rem",
                display: "block",
                mb: 0.5,
                color: isDarkMode ? "#A78BFA" : PURPLE_PRIMARY,
              }}
            >
              {senderName}
            </Typography>
          )}

          {/* Replied Message Preview */}
          {resolvedReplyId && (
            <Box
              sx={{
                borderLeft: `3px solid ${isOwn ? "#FFFFFF" : PURPLE_PRIMARY}`,
                pl: 1.25,
                py: 0.35,
                mb: 1,
                borderRadius: "4px",
                backgroundColor: isOwn
                  ? alpha("#000000", 0.15)
                  : alpha(PURPLE_PRIMARY, 0.08),
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 700,
                  fontSize: "0.72rem",
                  display: "block",
                  color: isOwn ? "#FFFFFF" : PURPLE_PRIMARY,
                }}
              >
                {String(replyUser?.id) === myId ? "You" : replyUser?.name || "User"}
              </Typography>
              <Typography
                variant="body2"
                noWrap
                sx={{
                  fontSize: "0.75rem",
                  color: isOwn ? alpha("#FFFFFF", 0.85) : theme.palette.text.secondary,
                }}
              >
                {repliedMessage?.text || (repliedMessage?.image ? "Photo" : repliedMessage?.file ? "PDF" : "Message")}
              </Typography>
            </Box>
          )}

          {/* Message Content */}
          {isDeleted ? (
            <Typography
              variant="body2"
              sx={{
                fontStyle: "italic",
                fontSize: "0.825rem",
                color: theme.palette.text.secondary,
              }}
            >
              This message was deleted
            </Typography>
          ) : (
            <>
              {/* Image Preview */}
              {image && (
                <Box
                  sx={{
                    borderRadius: "10px",
                    overflow: "hidden",
                    mb: text ? 0.75 : 0,
                    cursor: "pointer",
                    position: "relative",
                  }}
                  onClick={() => setLightboxImg(image)}
                >
                  <Box
                    component="img"
                    src={image}
                    alt="Shared"
                    sx={{
                      width: "100%",
                      maxHeight: 280,
                      objectFit: "cover",
                      display: "block",
                      borderRadius: "10px",
                      transition: "transform 200ms ease",
                      "&:hover": { transform: "scale(1.02)" },
                    }}
                  />
                </Box>
              )}

              {/* PDF Document Card */}
              {file && (
                <Link
                  component="button"
                  onClick={() => downloadFile(file, fileName || "document.pdf")}
                  underline="none"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.25,
                    p: 1.25,
                    mb: text ? 0.75 : 0,
                    borderRadius: "10px",
                    backgroundColor: isOwn
                      ? alpha("#FFFFFF", 0.15)
                      : isDarkMode
                      ? alpha("#FFFFFF", 0.05)
                      : "#FFFFFF",
                    border: `1px solid ${
                      isOwn
                        ? alpha("#FFFFFF", 0.25)
                        : isDarkMode
                        ? alpha("#FFFFFF", 0.1)
                        : "#E5E7EB"
                    }`,
                    color: isOwn ? "#FFFFFF" : theme.palette.text.primary,
                    transition: "all 150ms ease",
                    "&:hover": {
                      backgroundColor: isOwn
                        ? alpha("#FFFFFF", 0.22)
                        : alpha(PURPLE_PRIMARY, 0.06),
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 38,
                      height: 38,
                      borderRadius: "8px",
                      backgroundColor: "#EF4444",
                      color: "#FFFFFF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <PictureAsPdfRoundedIcon sx={{ fontSize: 22 }} />
                  </Box>
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography
                      variant="body2"
                      noWrap
                      sx={{ fontWeight: 600, fontSize: "0.825rem" }}
                    >
                      {fileName || "Document.pdf"}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: isOwn ? alpha("#FFFFFF", 0.75) : theme.palette.text.secondary,
                        fontSize: "0.7rem",
                      }}
                    >
                      PDF Document
                    </Typography>
                  </Box>
                  <FileDownloadRoundedIcon
                    sx={{
                      fontSize: 18,
                      color: isOwn ? alpha("#FFFFFF", 0.8) : theme.palette.text.secondary,
                    }}
                  />
                </Link>
              )}

              {/* Text Message */}
              {text && (
                <Typography
                  variant="body2"
                  component="div"
                  sx={{
                    fontSize: "0.875rem",
                    lineHeight: 1.45,
                    wordBreak: "break-word",
                    overflowWrap: "anywhere",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {text}
                </Typography>
              )}
            </>
          )}

          {/* Footer Metadata */}
          <Stack
            direction="row"
            spacing={0.5}
            sx={{
              mt: 0.5,
              alignItems: "center",
              justifyContent: "flex-end",
              userSelect: "none",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontSize: "0.68rem",
                color: isOwn ? alpha("#FFFFFF", 0.75) : theme.palette.text.secondary,
              }}
            >
              {time}
            </Typography>

            {isOwn && seen && !isDeleted && (
              <Typography
                variant="caption"
                sx={{
                  fontSize: "0.65rem",
                  fontWeight: 600,
                  color: "#93C5FD",
                  ml: 0.25,
                }}
              >
                • {seenTime ? `Read ${seenTime}` : "Seen"}
              </Typography>
            )}

            {!isDeleted && renderStatusIcon()}
          </Stack>

          {/* Reactions Pill Badge (fully visible, elevated with z-index) */}
          {hasReactions && !isDeleted && (
            <ShowingEmoji mess={mess} myId={myId} />
          )}
        </Paper>

        {/* Hover Quick Action Icons */}
        {isHovered && !isDeleted && <MessageIcons mess={mess} myId={myId} />}
      </Stack>

      {/* Lightbox Dialog */}
      <Dialog
        open={Boolean(lightboxImg)}
        onClose={() => setLightboxImg(null)}
        maxWidth="md"
        slotProps={{
          paper: {
            sx: { backgroundColor: "transparent", boxShadow: "none", p: 0 },
          },
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
                boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Stack>
  );
};

export default ShowingMessage;
