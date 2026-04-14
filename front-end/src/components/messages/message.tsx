/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Paper, Stack, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { NAV_BAR_HEIGHT } from "../../constants/common";
import { useEffect, useRef } from "react";
import ShowingMessage from "./showingMessage";
import { TUser } from "../../types";
import TypingIndicator from "./TypingIndicator";
import { ImgViewer } from "../imgViewer";
// import { emitMessageSeen } from "../../utils/socketService";

const Message = () => {
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
      messageEndRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [messages, isEmojiAdded]);
  // useEffect(() => {
  //   if (receiverId) {
  //     (Object.values(messages) as TMessage[][]).forEach(
  //       (msgArray: TMessage[]) => {
  //         msgArray.forEach((msg) => {
  //           if (msg.receiverId === receiverId && !msg.seen) {
  //             emitMessageSeen(receiverId, msg);
  //           }
  //         });
  //       }
  //     );
  //   }
  // }, [receiverId, messages]);
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

            {messages[date].map((mess: any) => {
              return (
                <ShowingMessage mess={mess} messageEndRef={messageEndRef} />
              );
            })}
          </Box>
        ))}

        {senderUser?.isTyping && (
          <Stack
            direction="row"
            spacing={2}
            sx={{
              justifyContent: "flex-start",
              alignItems: "flex-start",
            }}
          >
            <ImgViewer img={senderUser?.img} tooltipText={senderUser?.name} />
            <TypingIndicator />
          </Stack>
        )}
      </Box>
    </>
  );
};

export default Message;
