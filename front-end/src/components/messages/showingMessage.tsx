/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar, Box, Paper, Stack, Tooltip, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { formatTimes } from "../../utils/timeFormat";
import { useState } from "react";
import MessageIcons from "./messageIcons";
const ImgViewer = ({ img, tooltipText }: { img: any; tooltipText: string }) => {
  return (
    <>
      <Tooltip title={tooltipText}>
        <Avatar sx={{ width: 30, height: 30 }} src={img} />
      </Tooltip>
    </>
  );
};
const ShowingMessage = ({ mess, messageEndRef }: any) => {
  const { text, senderId, createdAt } = mess;
  const [isHovered, setIsHovered] = useState(false);

  const { loginUser, allUsers } = useSelector(
    (state: RootState) => state?.auth
  );
  const { _id: myId } = loginUser;
  const userInfo = allUsers.find((user: any) => user._id === senderId);
  // console.log({ isHovered });
  // console.log({ isMenuOpen });
  const isOwn = mess.senderId === myId;
  const time = formatTimes(createdAt);
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
          sx={{ width: "80%" }}
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
                  position: "relative",
                }}
              >
                <Typography variant="body1">{text}</Typography>
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
            </Paper>
          </Box>
          {isHovered && <MessageIcons mess={mess} myId={myId} />}
        </Stack>
      </Stack>
    </>
  );
};

export default ShowingMessage;
