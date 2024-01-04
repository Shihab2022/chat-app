import { Avatar, Stack, Typography } from "@mui/material";
import React from "react";

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
          >
            <Stack
              direction="row"
              justifyContent={`${
                mess.senderId === 1 ? "flex-end" : "flex-end"
              }`}
              alignItems="center"
              spacing={2}
            >
              <Avatar
                alt="Cindy Baker"
                sx={{ width: 24, height: 24 }}
                src="https://randomuser.me/api/portraits/men/1.jpg"
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
