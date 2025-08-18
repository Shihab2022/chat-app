/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar, Box, Paper, Stack, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { TMessage } from "../redux/features/chat/getConversationSlice";
import { NAV_BAR_HEIGHT } from "../constants/common";
import { useEffect, useRef } from "react";

const ImgViewer = ({ img }: { img: any }) => {
  return (
    <>
      <Avatar sx={{ width: 24, height: 24 }} src={img} />
    </>
  );
};

const Message = () => {
  const { messages = [] } = useSelector((state: RootState) => state?.message);
  const { loginUser, allUsers } = useSelector(
    (state: RootState) => state?.auth
  );
  const { _id: myId } = loginUser;
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
        {messages?.map((mess: TMessage) => {
          const { text, senderId } = mess;
          const userInfo = allUsers.find((user: any) => user._id === senderId);

          const isOwn = mess.senderId === myId;
          console.log({ mess });
          return (
            <>
              <Stack
                direction="row"
                justifyContent={`${
                  mess.senderId === myId ? "flex-end" : "flex-start"
                }`}
                alignItems="center"
                spacing={2}
                sx={{ marginY: "10px" }}
                ref={messageEndRef}
              >
                <Stack
                  direction={`${
                    mess.senderId === myId ? "row-reverse" : "row"
                  }`}
                  justifyContent="flex-start"
                  alignItems="center"
                  spacing={2}
                >
                  <ImgViewer img={userInfo?.img} />
                  {/* <Typography
                    key={i}
                    sx={{
                      textAlign: `${mess.senderId === myId ? "left" : "right"}`,
                    }}
                    paragraph
                  >
                    {text}
                  </Typography> */}

                  <Box
                    key={mess._id}
                    sx={{
                      display: "flex",
                      justifyContent: isOwn ? "flex-start" : "flex-end",
                      mb: 1,
                    }}
                  >
                    <Paper
                      elevation={1}
                      sx={{
                        paddingX: 1.5,
                        paddingY: 1, // maxWidth: "60%",
                        borderRadius: 2,
                        backgroundColor: isOwn ? "#DCF8C6" : "#fff", // WhatsApp green / white
                      }}
                    >
                      <Stack
                        direction={isOwn ? "row-reverse" : "row"}
                        spacing={2}
                        sx={{
                          justifyContent: "flex-start",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="body1">{text}</Typography>
                        <Stack
                          direction="row"
                          spacing={2}
                          sx={{
                            justifyContent: "flex-start",
                            alignItems: "flex-end",
                            height: "100%",
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
                            10:30 PM
                          </Typography>
                        </Stack>
                      </Stack>
                    </Paper>
                  </Box>
                </Stack>
              </Stack>
            </>
          );
        })}
      </Box>
    </>
  );
};

export default Message;
