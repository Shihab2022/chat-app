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
    (state: RootState) => state?.message
  );

  const isOwn = String(mess.sender_id) === String(myId);
  const uniqueEmojis = Array.from(
    new Set(mess.reactions?.map((r: Reaction) => r.emoji))
  );

  return (
    <>
      <Box
        onClick={(e) => {
          e.stopPropagation();
          dispatch(SET_EMOJI_DETAILS_DIALOG_STATUS(true));
          dispatch(
            SET_EMOJI_DETAILS_REACTIONS(
              mess?.reactions?.map((d: Reaction) => ({
                ...d,
                messId: mess.id,
              }))
            )
          );
        }}
        sx={{
          position: "absolute",
          bottom: -11,
          [isOwn ? "left" : "right"]: 8,
          backgroundColor: theme.palette.mode === "dark" ? "#1E293B" : "#FFFFFF",
          border: `1px solid ${theme.palette.mode === "dark" ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)"}`,
          boxShadow: `0 3px 10px ${alpha(theme.palette.common.black, 0.15)}`,
          borderRadius: "16px",
          px: 0.85,
          py: 0.2,
          cursor: "pointer",
          zIndex: 15,
          display: "inline-flex",
          alignItems: "center",
          userSelect: "none",
          transition: "all 0.15s ease",
          "&:hover": {
            transform: "scale(1.12)",
            boxShadow: `0 4px 14px ${alpha(theme.palette.common.black, 0.2)}`,
          },
        }}
      >
        <Stack direction="row" spacing={0.35} sx={{ alignItems: "center" }}>
          {uniqueEmojis.map((emoji, idx) => (
            <span key={idx} style={{ fontSize: "0.85rem", lineHeight: 1 }}>
              {emoji}
            </span>
          ))}
          {mess.reactions && mess.reactions.length > 1 && (
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                fontSize: "0.7rem",
                color: theme.palette.mode === "dark" ? "#E2E8F0" : "#475569",
                ml: 0.25,
              }}
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
