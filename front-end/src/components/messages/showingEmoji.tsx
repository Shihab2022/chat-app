/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Stack, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { alpha, useTheme } from "@mui/material/styles";
import {
  SET_EMOJI_DETAILS_DIALOG_STATUS,
  SET_EMOJI_DETAILS_REACTIONS,
} from "../../redux/features/chat/conversationSlice";
import EmojiDetailsDialog from "../emoji/dialogEmojiDetails";
import { RootState } from "../../redux/store";
import { Reaction, TMessage } from "../../types";

const ShowingEmoji = ({ mess, myId }: { mess: TMessage; myId: string }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { emojiDetailsDialogStatus } = useSelector(
    (state: RootState) => state?.message,
  );

  const isOwn = mess.sender_id === myId;
  const uniqueEmojis = Array.from(
    new Set(mess.reactions?.map((r: Reaction) => r.emoji)),
  );

  return (
    <>
      <Box
        onClick={() => {
          dispatch(SET_EMOJI_DETAILS_DIALOG_STATUS(true));
          dispatch(
            SET_EMOJI_DETAILS_REACTIONS(
              mess?.reactions?.map((d: Reaction) => ({
                ...d,
                messId: mess.id,
              })),
            ),
          );
        }}
        sx={{
          position: "absolute",
          bottom: -12,
          [isOwn ? "left" : "right"]: 12,
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: `0 2px 6px ${alpha(theme.palette.common.black, 0.08)}`,
          borderRadius: 4,
          px: 0.75,
          py: 0.25,
          cursor: "pointer",
          zIndex: 2,
          transition: "transform 0.15s ease",
          "&:hover": { transform: "scale(1.1)" },
        }}
      >
        <Stack direction="row" spacing={0.5} alignItems="center">
          {uniqueEmojis.map((emoji, idx) => (
            <span key={idx} style={{ fontSize: "0.85rem", lineHeight: 1 }}>
              {emoji}
            </span>
          ))}
          {mess.reactions && mess.reactions.length > 1 && (
            <Typography
              variant="caption"
              sx={{ fontWeight: 700, fontSize: "0.7rem", ml: 0.25 }}
            >
              {mess.reactions.length}
            </Typography>
          )}
        </Stack>
      </Box>

      {emojiDetailsDialogStatus && <EmojiDetailsDialog />}
    </>
  );
};
export default ShowingEmoji;
