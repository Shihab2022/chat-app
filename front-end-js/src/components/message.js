import { Avatar, Stack, Typography } from "@mui/material";
import React from "react";

const ImgViewer = ({ img, mess }) => {
  return (
    <>
      <Avatar sx={{ width: 24, height: 24 }} src={img} />
    </>
  );
};

const Message = ({ messageData }) => {
  const parseTimestamp = (timestamp) => new Date(timestamp);

  // Sorting the array based on the timestamp property
  const sortedData = messageData.sort((a, b) => {
    const dateA = parseTimestamp(a.timestamp);
    const dateB = parseTimestamp(b.timestamp);

    return dateA - dateB;
  });
  return (
    <>
      {sortedData.map((mess, i) => (
        <>
          <Stack
            direction="row"
            justifyContent={`${
              mess.senderId === 1 ? "flex-start" : "flex-end"
            }`}
            alignItems="center"
            spacing={2}
            sx={{ marginY: "5px" }}
          >
            <Stack
              direction={`${mess.senderId === 1 ? "row" : "row-reverse"}`}
              justifyContent="flex-start"
              alignItems="center"
              spacing={2}
            >
              <ImgViewer
                img={`${
                  mess.senderId === 1
                    ? "https://randomuser.me/api/portraits/men/1.jpg"
                    : "https://randomuser.me/api/portraits/men/10.jpg"
                }`}
                mess={mess}
              />
              <Typography
                key={i}
                sx={{ textAlign: `${mess.senderId === 1 ? "left" : "right"}` }}
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
