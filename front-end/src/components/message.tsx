/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar, Box, Paper, Stack, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { TMessage } from "../redux/features/chat/getConversationSlice";
import { NAV_BAR_HEIGHT } from "../constants/common";
import { useEffect, useRef } from "react";
import { formatTimes } from "../utils/timeFormat";

const ImgViewer = ({ img }: { img: any }) => {
  return (
    <>
      <Avatar sx={{ width: 24, height: 24 }} src={img} />
    </>
  );
};

const Message = () => {
  const { messages = {} } = useSelector((state: RootState) => state?.message);
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
              const { text, senderId, createdAt } = mess;
              const userInfo = allUsers.find(
                (user: any) => user._id === senderId
              );

              const isOwn = mess.senderId === myId;
              const time = formatTimes(createdAt);
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
                            paddingY: 1,
                            borderRadius: 2,
                            backgroundColor: isOwn ? "#DCF8C6" : "#fff",
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
                                {time || "10:30 PM"}
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
          </div>
        ))}
        {/* {messages?.map((mess: TMessage) => {
          const { text, senderId, createdAt } = mess;
          const userInfo = allUsers.find((user: any) => user._id === senderId);

          const isOwn = mess.senderId === myId;
          const time = formatTimes(createdAt);
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
                        paddingY: 1,
                        borderRadius: 2,
                        backgroundColor: isOwn ? "#DCF8C6" : "#fff", 
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
                            {time || "10:30 PM"}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Paper>
                  </Box>
                </Stack>
              </Stack>
            </>
          );
        })} */}
      </Box>
    </>
  );
};

export default Message;
