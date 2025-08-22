/* eslint-disable @typescript-eslint/no-explicit-any */
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Menu } from "@mui/material";
import {
  SET_EMOJI_ANCHOR_EL,
  SET_EMOJI_STATUS,
} from "../../redux/features/chat/getConversationSlice";

const EmojiPicker = ({ onEmojiChanges }: { onEmojiChanges: any }) => {
  const { isEmojiOpen, anchorElEmoji } = useSelector(
    (state: RootState) => state?.message
  );
  const dispatch = useDispatch();
  return (
    <>
      <Menu
        id="basic-menu"
        open={isEmojiOpen}
        anchorEl={anchorElEmoji}
        onClose={() => {
          dispatch(SET_EMOJI_ANCHOR_EL(null));
          dispatch(SET_EMOJI_STATUS(!isEmojiOpen));
        }}
        slotProps={{
          list: {
            "aria-labelledby": "basic-button",
          },
        }}
      >
        {isEmojiOpen && (
          <div className="absolute bottom-12 left-100 z-10">
            <Picker
              data={data}
              onEmojiSelect={(emoji: { native: string }) => {
                onEmojiChanges(emoji.native);
              }}
            />
          </div>
        )}
      </Menu>
    </>
  );
};

export default EmojiPicker;
