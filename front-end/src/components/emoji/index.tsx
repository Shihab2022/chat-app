/* eslint-disable @typescript-eslint/no-explicit-any */
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Box, Menu } from "@mui/material";
import {
  SET_EMOJI_ANCHOR_EL,
  SET_EMOJI_STATUS,
  SET_EMOJI_WITH_DATA,
} from "../../redux/features/chat/conversationSlice";
import { addEmoji } from "../../services/message";

const EmojiPicker = ({
  onEmojiChanges,
}: {
  onEmojiChanges?: (emoji: string) => void;
}) => {
  const dispatch = useDispatch();
  const { isEmojiOpen, anchorElEmoji, isOneIcon, receiverId, selectedMessage } =
    useSelector((state: RootState) => state?.message);
  const { loginUser } = useSelector((state: RootState) => state?.auth);
  const myId = loginUser?.id;

  const handleReactionEmoji = async (emoji: string) => {
    if (!selectedMessage?.id || String(selectedMessage.id).startsWith("local-")) {
      return;
    }

    const params = {
      messageId: selectedMessage.id,
      userId: myId,
      emoji,
      receiverId,
    };

    try {
      const res = await addEmoji(params);
      if (res?.success) {
        dispatch(SET_EMOJI_WITH_DATA(res?.data));
      }
    } catch (error) {
      console.error("Failed to add reaction:", error);
    }
  };

  return (
    <Menu
      id="message-emoji-menu"
      open={isEmojiOpen}
      anchorEl={anchorElEmoji}
      onClose={() => {
        dispatch(SET_EMOJI_ANCHOR_EL(null));
        dispatch(SET_EMOJI_STATUS(false));
      }}
      slotProps={{
        paper: {
          sx: {
            borderRadius: 2,
            overflow: "hidden",
          },
        },
      }}
    >
      {isEmojiOpen && (
        <Box sx={{ p: 0.5, minWidth: 352, maxWidth: "calc(100vw - 24px)" }}>
          <Picker
            data={data}
            onEmojiSelect={(emoji: { native: string }) => {
              if (isOneIcon) {
                void handleReactionEmoji(emoji.native);
              } else {
                onEmojiChanges?.(emoji.native);
              }
              dispatch(SET_EMOJI_ANCHOR_EL(null));
              dispatch(SET_EMOJI_STATUS(false));
            }}
            previewPosition="none"
          />
        </Box>
      )}
    </Menu>
  );
};

export default EmojiPicker;
