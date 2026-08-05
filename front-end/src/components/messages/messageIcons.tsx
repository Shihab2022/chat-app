import { useState, MouseEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IconButton, Menu, Stack, Tooltip } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import ReplyIcon from "@mui/icons-material/Reply";
import AddIcon from "@mui/icons-material/Add";

import { RootState } from "../../redux/store";
import { TMessage } from "../../types";
import {
  SET_EMOJI_ANCHOR_EL,
  SET_EMOJI_STATUS,
  SET_EMOJI_WITH_DATA,
  SET_ONE_ICON,
  SET_REPLIED_MESSAGE,
  SET_SELECTED_MESSAGE,
} from "../../redux/features/chat/conversationSlice";
import { addEmoji } from "../../services/message";
import MoreActions from "./moreAction";

const QUICK_EMOJIS = ["❤️", "👍", "😂", "😥", "🤲"];

interface MessageIconsProps {
  mess: TMessage;
  myId: string;
}

const MessageIcons = ({ mess, myId }: MessageIconsProps) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const { isEmojiOpen, receiverId } = useSelector(
    (state: RootState) => state?.message,
  );

  const [iconAnchorEl, setIconAnchorEl] = useState<null | HTMLElement>(null);
  const [moreAnchorEl, setMoreActionAnchorEl] = useState<null | HTMLElement>(
    null,
  );

  const isIconMenuOpen = Boolean(iconAnchorEl);
  const moreActionOpen = Boolean(moreAnchorEl);

  const handleEmoji = async (emoji: string) => {
    const params = { messageId: mess?.id, userId: myId, emoji, receiverId };
    try {
      const res = await addEmoji(params);
      if (res?.success) {
        dispatch(SET_EMOJI_WITH_DATA(res?.data));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIconAnchorEl(null);
    }
  };

  return (
    <>
      <Stack
        direction="row"
        spacing={0.5}
        sx={{
          backgroundColor: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: "blur(8px)",
          borderRadius: 6,
          px: 0.5,
          py: 0.25,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Tooltip title="React">
          <IconButton
            size="small"
            onClick={(e: MouseEvent<HTMLElement>) =>
              setIconAnchorEl(e.currentTarget)
            }
          >
            <InsertEmoticonIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Reply">
          <IconButton
            size="small"
            onClick={() => dispatch(SET_REPLIED_MESSAGE(mess))}
          >
            <ReplyIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="More">
          <IconButton
            size="small"
            onClick={(e: MouseEvent<HTMLElement>) =>
              setMoreActionAnchorEl(e.currentTarget)
            }
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>

      {/* Emoji Picker Popover */}
      <Menu
        anchorEl={iconAnchorEl}
        open={isIconMenuOpen}
        onClose={() => setIconAnchorEl(null)}
        PaperProps={{
          elevation: 0,
          sx: {
            borderRadius: 8,
            p: 0.5,
            backgroundColor: alpha(theme.palette.background.paper, 0.95),
            backdropFilter: "blur(12px)",
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.12)}`,
          },
        }}
      >
        <Stack direction="row" spacing={0.5} alignItems="center">
          {QUICK_EMOJIS.map((emoji) => (
            <IconButton
              key={emoji}
              size="small"
              onClick={() => handleEmoji(emoji)}
              sx={{
                fontSize: "1.1rem",
                transition: "transform 0.15s ease",
                "&:hover": { transform: "scale(1.2)" },
              }}
            >
              {emoji}
            </IconButton>
          ))}

          <IconButton
            size="small"
            onClick={() => {
              dispatch(SET_EMOJI_ANCHOR_EL(iconAnchorEl));
              dispatch(SET_EMOJI_STATUS(!isEmojiOpen));
              dispatch(SET_SELECTED_MESSAGE(mess));
              dispatch(SET_ONE_ICON(true));
              setIconAnchorEl(null);
            }}
          >
            <AddIcon
              sx={{
                backgroundColor: theme.palette.action.hover,
                borderRadius: "50%",
                fontSize: 20,
              }}
            />
          </IconButton>
        </Stack>
      </Menu>

      <MoreActions
        setMoreActionAnchorEl={setMoreActionAnchorEl}
        setMoreActionOpen={() => {}}
        moreActionOpen={moreActionOpen}
        moreAnchorEl={moreAnchorEl}
        mess={mess}
        setIconMenuOpen={() => {}}
        setIconAnchorEl={setIconAnchorEl}
      />
    </>
  );
};

export default MessageIcons;
