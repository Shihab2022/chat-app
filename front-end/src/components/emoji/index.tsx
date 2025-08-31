/* eslint-disable @typescript-eslint/no-explicit-any */
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Menu } from "@mui/material";
import {
  SET_EMOJI_ANCHOR_EL,
  SET_EMOJI_STATUS,
  SET_EMOJI_WITH_DATA,
} from "../../redux/features/chat/getConversationSlice";
import { addEmoji } from "../../services/message";

const EmojiPicker = ({
  onEmojiChanges,
  onEmojiChangesFromMessage,
}: {
  onEmojiChanges?: any;
  onEmojiChangesFromMessage?: any;
}) => {
  const { isEmojiOpen, anchorElEmoji, isOneIcon, receiverId, selectedMessage } =
    useSelector((state: RootState) => state?.message);
  const { loginUser } = useSelector((state: RootState) => state?.auth);
  const { _id: myId } = loginUser;

  const handleEmoji = async (emoji: string) => {
    const params = {
      messageId: selectedMessage?._id,
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
      console.log({ error });
    }
  };
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
      >
        {isEmojiOpen && (
          <div className="absolute bottom-12 left-100 z-10">
            <Picker
              data={data}
              onEmojiSelect={(emoji: { native: string }) => {
                if (isOneIcon) {
                  handleEmoji(emoji.native);
                  dispatch(SET_EMOJI_ANCHOR_EL(null));
                  dispatch(SET_EMOJI_STATUS(!isEmojiOpen));
                }
                isOneIcon
                  ? onEmojiChangesFromMessage(emoji.native)
                  : onEmojiChanges(emoji.native);
              }}
              previewPosition="none"
            />
          </div>
        )}
      </Menu>
    </>
  );
};

export default EmojiPicker;
