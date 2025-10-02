/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Paper, Stack, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { formatTimes } from "../../utils/timeFormat";
import { useState } from "react";
import MessageIcons from "./messageIcons";
import ShowingEmoji from "./showingEmoji";
import { ImgViewer } from "../imgViewer";

const ShowingMessage = ({ mess, messageEndRef }: any) => {
  const { text, senderId, createdAt, isDeleted, replyId } = mess;
  const [isHovered, setIsHovered] = useState(false);
  const { loginUser, allUsers } = useSelector(
    (state: RootState) => state?.auth
  );
  const { messages = {} } = useSelector((state: RootState) => state?.message);
  const { _id: myId } = loginUser;
  const userInfo = allUsers.find((user: any) => user._id === senderId);
  const isOwn = mess.senderId === myId;
  const time = formatTimes(createdAt);

  const repliedMessage = replyId
    ? Object.values(messages)
        .flat()
        .find((m: any) => m._id === replyId)
    : undefined;
  const replyUser = repliedMessage
    ? allUsers.find((user: any) => user._id === repliedMessage.senderId)
    : undefined;
  return (
    <>
      <Stack
        direction="row"
        justifyContent={`${mess.senderId === myId ? "flex-end" : "flex-start"}`}
        alignItems="center"
        spacing={2}
        sx={{ marginY: "10px" }}
        ref={messageEndRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Stack
          direction={`${mess.senderId === myId ? "row-reverse" : "row"}`}
          justifyContent="flex-start"
          alignItems="center"
          spacing={2}
          sx={{ width: "100%" }}
        >
          <Stack
            direction={`${mess.senderId === myId ? "row-reverse" : "row"}`}
            justifyContent="flex-start"
            alignItems="center"
            spacing={2}
            sx={{ maxWidth: "80%" }}
          >
            <ImgViewer img={userInfo?.img} tooltipText={userInfo?.name} />
            <Box
              key={mess._id}
              sx={{
                display: "flex",
                justifyContent: isOwn ? "flex-start" : "flex-end",
                mb: 1,
              }}
            >
              <Paper
                elevation={isDeleted ? 0 : 1}
                sx={{
                  paddingX: 1.5,
                  paddingY: 1,
                  borderRadius: 2,
                  backgroundColor: isOwn && !isDeleted ? "#DCF8C6" : "#fff",
                  position: "relative",
                  display: "inline-block",
                  border: isDeleted ? "1px solid #e07575ff" : "none",
                  maxWidth: "100%", // 👈 keep bubble size realistic like WhatsApp
                }}
              >
                <Stack
                  direction={isOwn ? "row-reverse" : "row"}
                  spacing={2}
                  sx={{
                    justifyContent: "flex-start",
                    alignItems: "center",
                    position: "relative",
                  }}
                >
                  <Stack spacing={0.5}>
                    {/* ✅ Reply Preview Section */}
                    {replyId && (
                      <Box
                        sx={{
                          borderLeft: "3px solid #4caf50",
                          pl: 1,
                          mb: 1,
                          py: 0.5,
                          borderRadius: "4px",
                          backgroundColor: "#f0f0f0",
                          fontSize: "12px",
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{ fontWeight: 600, color: "#9aaa9bff" }}
                        >
                          {replyUser?._id === myId ? "You" : replyUser?.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          noWrap
                          sx={{ fontSize: "12px", color: "#555" }}
                        >
                          {repliedMessage?.text &&
                          repliedMessage.text.length > 100
                            ? repliedMessage.text.slice(0, 100) + "..."
                            : repliedMessage?.text || ""}
                        </Typography>
                      </Box>
                    )}

                    <Stack
                      direction={isOwn ? "row-reverse" : "row"}
                      spacing={2}
                      sx={{
                        justifyContent: "flex-start",
                        alignItems: "center",
                        position: "relative",
                      }}
                    >
                      {isDeleted ? (
                        <Typography sx={{ color: "#e07575ff" }} variant="body1">
                          {` ${
                            mess.senderId === myId ? "You" : userInfo?.name
                          } deleted this message`}
                        </Typography>
                      ) : (
                        <Typography variant="body1">{text}</Typography>
                      )}
                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",
                          textAlign: "right",
                          mt: 0.5,
                          opacity: 0.7,
                          fontSize: "10px",
                        }}
                      >
                        {time || "10:30 PM"}
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>

                {/* ✅ Emoji Reactions */}
                {mess?.reactions?.length > 0 && !isDeleted && (
                  <ShowingEmoji mess={mess} myId={myId} />
                )}
              </Paper>
            </Box>
          </Stack>

          {isHovered && !isDeleted && <MessageIcons mess={mess} myId={myId} />}
        </Stack>
      </Stack>
    </>
  );
};

export default ShowingMessage;
