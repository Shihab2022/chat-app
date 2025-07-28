/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar, Stack, Typography } from "@mui/material";
import { myRandomProfile } from "../constants/demoUserData";

export type TMessage = {
  senderId: number;
  receiverId: number;
  content: string;
  timestamp: string;
};

const ImgViewer = ({ img }: { img: any }) => {
  return (
    <>
      <Avatar sx={{ width: 24, height: 24 }} src={img} />
    </>
  );
};

const Message = ({ messageData }: { messageData: any }) => {
  const parseTimestamp = (timestamp: string | number | Date) =>
    new Date(timestamp);

  // Sorting the array based on the timestamp property
  const sortedData = messageData.sort(
    (
      a: { timestamp: string | Date | any },
      b: { timestamp: string | Date | any }
    ) => {
      const dateA: Date = parseTimestamp(a.timestamp);
      const dateB = parseTimestamp(b.timestamp);

      return dateA - dateB;
    }
  );
  return (
    <>
      {sortedData.map((mess: TMessage, i: number) => (
        <>
          <Stack
            direction="row"
            justifyContent={`${
              mess.senderId === myRandomProfile?.id ? "flex-start" : "flex-end"
            }`}
            alignItems="center"
            spacing={2}
            sx={{ marginY: "5px" }}
          >
            <Stack
              direction={`${
                mess.senderId === myRandomProfile?.id ? "row" : "row-reverse"
              }`}
              justifyContent="flex-start"
              alignItems="center"
              spacing={2}
            >
              <ImgViewer
                img={`${
                  mess.senderId === myRandomProfile?.id
                    ? "https://randomuser.me/api/portraits/men/1.jpg"
                    : "https://randomuser.me/api/portraits/men/10.jpg"
                }`}
              />
              <Typography
                key={i}
                sx={{
                  textAlign: `${
                    mess.senderId === myRandomProfile?.id ? "left" : "right"
                  }`,
                }}
                paragraph
              >
                {mess.content}
              </Typography>
            </Stack>
          </Stack>
        </>
      ))}
    </>
  );
};

export default Message;
