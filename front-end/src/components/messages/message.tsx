/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Stack, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { TMessage } from "../../redux/features/chat/getConversationSlice";
import { NAV_BAR_HEIGHT } from "../../constants/common";
import { useEffect, useRef } from "react";
import ShowingMessage from "./showingMessage";

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
          <div key={date}>
            <Stack
              direction="row"
              spacing={2}
              sx={{
                justifyContent: "center",
                alignItems: "center",
                marginTop: "10px",
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  textAlign: "right",
                  mt: 0.5,
                  opacity: 0.7,
                }}
              >
                {date}
              </Typography>
            </Stack>

            {messages[date].map((mess: TMessage) => {
              return (
                <ShowingMessage mess={mess} messageEndRef={messageEndRef} />
              );
            })}
          </div>
        ))}
      </Box>
    </>
  );
};

export default Message;
