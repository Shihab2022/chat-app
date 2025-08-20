/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar, Box, Paper, Stack, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { formatTimes } from "../../utils/timeFormat";

const ImgViewer = ({ img }: { img: any }) => {
  return (
    <>
      <Avatar sx={{ width: 24, height: 24 }} src={img} />
    </>
  );
};
const ShowingMessage = ({ mess, messageEndRef }: any) => {
  const { text, senderId, createdAt } = mess;
  const { loginUser, allUsers } = useSelector(
    (state: RootState) => state?.auth
  );
  const { _id: myId } = loginUser;
  const userInfo = allUsers.find((user: any) => user._id === senderId);

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
      >
        <Stack
          direction={`${mess.senderId === myId ? "row-reverse" : "row"}`}
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
};

export default ShowingMessage;
