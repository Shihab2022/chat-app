import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Box, Paper, Stack, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";

import { RootState } from "../../redux/store";
import { NAV_BAR_HEIGHT } from "../../constants/common";
import { TUser } from "../../types";
import ShowingMessage from "./showingMessage";
import TypingIndicator from "./TypingIndicator";
import { ImgViewer } from "../imgViewer";

const Message = () => {
  const theme = useTheme();
  const {
    messages = {},
    isEmojiAdded,
    receiverId,
  } = useSelector((state: RootState) => state?.message);
  const { allUsers } = useSelector((state: RootState) => state?.auth);

  const senderUser = allUsers.find((u: TUser) => u.id === receiverId);
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messageEndRef.current && messages && !isEmojiAdded) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isEmojiAdded]);

  return (
    <Box
      sx={{
        pt: `${NAV_BAR_HEIGHT + 16}px`,
        pb: 3,
        px: { xs: 1.5, sm: 3 },
        maxWidth: 1000,
        mx: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {Object.keys(messages).map((date) => (
        <Box key={date} sx={{ width: "100%" }}>
          {/* Date Header Pill */}
          <Stack direction="row" justifyContent="center" sx={{ my: 2 }}>
            <Paper
              elevation={0}
              sx={{
                px: 2,
                py: 0.5,
                borderRadius: 4,
                backgroundColor: alpha(theme.palette.text.primary, 0.06),
                backdropFilter: "blur(8px)",
                border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 600,
                  color: theme.palette.text.secondary,
                  letterSpacing: 0.5,
                }}
              >
                {date}
              </Typography>
            </Paper>
          </Stack>

          {/* Messages for this date */}
          <Stack spacing={1.5}>
            {messages[date]?.map((mess) => (
              <ShowingMessage
                key={mess.id}
                mess={{ ...mess, seen: mess.seen ?? false }}
                messageEndRef={messageEndRef}
              />
            ))}
          </Stack>
        </Box>
      ))}

      {/* Typing Indicator Bubble */}
      {senderUser?.isTyping && (
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="flex-end"
          sx={{ mt: 1, ml: 1 }}
        >
          <ImgViewer img={senderUser?.img} tooltipText={senderUser?.name} />
          <Paper
            elevation={0}
            sx={{
              px: 2,
              py: 1,
              borderRadius: "18px 18px 18px 4px",
              backgroundColor: alpha(theme.palette.background.paper, 0.9),
              border: `1px solid ${theme.palette.divider}`,
              display: "inline-block",
            }}
          >
            <TypingIndicator />
          </Paper>
        </Stack>
      )}
    </Box>
  );
};

export default Message;
