/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Paper, Stack, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { NAV_BAR_HEIGHT } from "../../constants/common";
import { useEffect, useRef } from "react";
import ShowingMessage from "./showingMessage";
import { TMessage } from "../../types";

const Message = () => {
  const { messages = {} } = useSelector((state: RootState) => state?.message);
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <>
      <Box sx={{ paddingTop: NAV_BAR_HEIGHT }}>
        {Object.keys(messages).map((date) => (
          <Box key={date}>
            <Stack
              direction="row"
              spacing={2}
              sx={{
                justifyContent: "center",
                alignItems: "center",
                marginTop: "10px",
              }}
            >
              <Paper
                elevation={1}
                sx={{
                  paddingX: 2.5,
                  paddingY: 0.5,
                  borderRadius: 1,
                  backgroundColor: "#fff",
                }}
              >
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      textAlign: "right",
                      mt: 0.5,
                      opacity: 0.7,
                      color: "#000",
                    }}
                  >
                    {date}
                  </Typography>
                </Stack>
              </Paper>
            </Stack>

            {messages[date].map((mess: TMessage) => {
              return (
                <ShowingMessage mess={mess} messageEndRef={messageEndRef} />
              );
            })}
          </Box>
        ))}
      </Box>
    </>
  );
};

export default Message;
