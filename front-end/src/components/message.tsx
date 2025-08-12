/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar, Stack, Typography } from "@mui/material";
import { useSelector } from "react-redux";

export type TMessage = {
  senderId: number;
  receiverId: number;
  text: string;
  timestamp: string;
};

const ImgViewer = ({ img }: { img: any }) => {
  return (
    <>
      <Avatar sx={{ width: 24, height: 24 }} src={img} />
    </>
  );
};

const Message = ({ allUsers }: any) => {
  const { messages = [] } = useSelector((state) => state?.message);
  const { loginUser } = useSelector((state) => state?.auth);
  const { _id: myId } = loginUser;
  return (
    <>
      {messages?.map((mess: TMessage, i: number) => {
        const { text, senderId } = mess;
        const userInfo = allUsers.find((user: any) => user._id === senderId);
        return (
          <>
            <Stack
              direction="row"
              justifyContent={`${
                mess.senderId === myId ? "flex-start" : "flex-end"
              }`}
              alignItems="center"
              spacing={2}
              sx={{ marginY: "5px" }}
            >
              <Stack
                direction={`${mess.senderId === myId ? "row" : "row-reverse"}`}
                justifyContent="flex-start"
                alignItems="center"
                spacing={2}
              >
                <ImgViewer img={userInfo?.img} />
                <Typography
                  key={i}
                  sx={{
                    textAlign: `${mess.senderId === myId ? "left" : "right"}`,
                  }}
                  paragraph
                >
                  {text}
                </Typography>
              </Stack>
            </Stack>
          </>
        );
      })}
    </>
  );
};

export default Message;
