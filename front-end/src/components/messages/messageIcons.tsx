/* eslint-disable @typescript-eslint/no-explicit-any */
import { IconButton, Menu, Stack } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import ReplyIcon from "@mui/icons-material/Reply";
import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import {
  SET_EMOJI_ANCHOR_EL,
  SET_EMOJI_STATUS,
  SET_EMOJI_WITH_DATA,
  SET_ONE_ICON,
} from "../../redux/features/chat/getConversationSlice";
import { addEmoji } from "../../services/message";
const MessageIcons = ({ mess, myId }: { mess: any; myId: string }) => {
  const { isEmojiOpen, receiverId } = useSelector(
    (state: RootState) => state?.message
  );
  const dispatch = useDispatch();
  const [isIconMenuOpen, setIconMenuOpen] = useState(false);
  const [iconAnchorEl, setIconAnchorEl] = useState<null | HTMLElement>(null);

  const handleEmoji = async (emoji: string) => {
    const params = { messageId: mess?._id, userId: myId, emoji, receiverId };
    try {
      const res = await addEmoji(params);
      if (res?.success) {
        dispatch(SET_EMOJI_WITH_DATA(res?.data));
      }
    } catch (error) {
      console.log({ error });
    } finally {
      setIconMenuOpen(false);
      setIconAnchorEl(null);
    }
  };
  return (
    <>
      <Stack
        direction={`${mess.senderId === myId ? "row-reverse" : "row"}`}
        sx={{
          justifyContent: "flex-start",
        }}
      >
        <IconButton
          onClick={(e) => {
            setIconMenuOpen(true);
            setIconAnchorEl(e.currentTarget);
          }}
          aria-label="menu"
        >
          <InsertEmoticonIcon />
        </IconButton>
        <IconButton aria-label="menu">
          <ReplyIcon />
        </IconButton>
        <IconButton aria-label="menu">
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="fade-menu"
          sx={{ borderRadius: "500px" }}
          anchorEl={iconAnchorEl}
          open={isIconMenuOpen}
          onClose={() => {
            setIconMenuOpen(false);
            setIconAnchorEl(null);
          }}
          PaperProps={{
            sx: {
              borderRadius: "300px",
              overflow: "hidden",
              // Additional styling
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            },
          }}
        >
          <Stack
            direction="row"
            // spacing={1}
            sx={{
              justifyContent: "flex-start",
              alignItems: "center",
              px: 2,
              borderRadius: "500px",
            }}
          >
            <IconButton onClick={() => handleEmoji("❤️")} aria-label="menu">
              {" "}
              ❤️
            </IconButton>
            <IconButton onClick={() => handleEmoji("👍")} aria-label="menu">
              {" "}
              👍
            </IconButton>
            <IconButton onClick={() => handleEmoji("😂")} aria-label="menu">
              😂
            </IconButton>
            <IconButton onClick={() => handleEmoji("😥")} aria-label="menu">
              {" "}
              😥
            </IconButton>
            <IconButton onClick={() => handleEmoji("🤲")} aria-label="menu">
              🤲
            </IconButton>
            <IconButton
              onClick={() => {
                setIconMenuOpen(false);
                dispatch(SET_EMOJI_ANCHOR_EL(iconAnchorEl));
                dispatch(SET_EMOJI_STATUS(!isEmojiOpen));
                dispatch(SET_ONE_ICON(true));
                setIconAnchorEl(null);
              }}
              aria-label="menu"
            >
              {" "}
              <AddIcon
                sx={{
                  background: "gray",
                  borderRadius: "100%",
                  color: "white",
                  fontSize: "20px",
                }}
              />
            </IconButton>
          </Stack>
        </Menu>
      </Stack>

      {/* <EmojiPicker
        // onEmojiChanges={(e: any) => setMessage((prev) => prev + e)}
        onEmojiChangesFromMessage={(e: any) => console.log({ e })}
      /> */}
    </>
  );
};

export default MessageIcons;
