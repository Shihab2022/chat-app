/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Stack, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  SET_EMOJI_DETAILS_DIALOG_STATUS,
  SET_EMOJI_DETAILS_REACTIONS,
} from "../../redux/features/chat/conversationSlice";
import EmojiDetailsDialog from "../emoji/dialogEmojiDetails";
import { RootState } from "../../redux/store";

const ShowingEmoji = ({ mess, myId }: any) => {
  const dispatch = useDispatch();
  const { emojiDetailsDialogStatus } = useSelector(
    (state: RootState) => state?.message,
  );
  return (
    <>
      <Box
        onClick={() => {
          dispatch(SET_EMOJI_DETAILS_DIALOG_STATUS(true));
          dispatch(
            SET_EMOJI_DETAILS_REACTIONS(
              mess?.reactions.map((d: any) => ({ ...d, messId: mess.id })),
            ),
          );
        }}
        sx={{
          position: "absolute",
          background: "#fff",
          boxShadow: 1,
          cursor: "pointer",
          bottom: -25, // push it *outside* the bubble
          borderRadius: "10px",
          padding: "3px 1px",
          fontSize: "18px",
          ...(mess.sender_id === myId ? { left: 1 } : { right: 1 }),
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
            ),
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
      {emojiDetailsDialogStatus && <EmojiDetailsDialog />}
    </>
  );
};

export default ShowingEmoji;
