/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Stack, Typography } from "@mui/material";

const ShowingEmoji = ({ mess, myId }: any) => {
  return (
    <>
      <Box
        sx={{
          position: "absolute",
          background: "#fff",
          boxShadow: 1,
          cursor: "pointer",
          bottom: -25, // push it *outside* the bubble
          borderRadius: "10px",
          padding: "3px 1px",
          fontSize: "18px",
          ...(mess.senderId === myId ? { left: 1 } : { right: 1 }),
        }}
      >
        <Stack
          direction="row"
          sx={{
            justifyContent: "flex-start",
            alignItems: "flex-start",
          }}
        >
          {[...new Set(mess.reactions.map((r: any) => r.emoji))].map(
            (emoji: any, idx: number) => (
              <span key={idx}>{emoji}</span>
            )
          )}
          {mess?.reactions?.length > 1 && (
            <Typography
              sx={{
                fontSize: "15px",
                marginX: "3px",
                fontWeight: 50,
              }}
            >
              {mess?.reactions?.length}
            </Typography>
          )}
        </Stack>
      </Box>
    </>
  );
};

export default ShowingEmoji;
