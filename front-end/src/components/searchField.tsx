/* eslint-disable @typescript-eslint/no-explicit-any */
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import SendIcon from "@mui/icons-material/Send";
import { showToast } from "../utils/toast";
import { COMMON_ERROR_MESSAGE, FAILED } from "../constants/common";
import { sendMessage } from "../services/message";
import { useDispatch, useSelector } from "react-redux";
import {
  SET_CONVERSATION,
  SET_EMOJI_ANCHOR_EL,
  SET_EMOJI_STATUS,
  SET_ONE_ICON,
} from "../redux/features/chat/getConversationSlice";
import { RootState } from "../redux/store";
import { groupMessagesByDate } from "../utils/timeFormat";
import EmojiPicker from "./emoji";
import useDebouncedText from "../utils/debouncedSearch";
export default function SearchField({ myId }: { myId: string }) {
  const dispatch = useDispatch();

  // const [message, setMessage] = useState("");
  const { receiverId, isEmojiOpen } = useSelector(
    (state: RootState) => state?.message
  );
  const { handleInputChange, message, stopTypingEvent } =
    useDebouncedText(receiverId);
  const handleClick = async () => {
    const messageData = {
      senderId: myId,
      receiverId: receiverId,
      text: message,
    };

    try {
      const res = await sendMessage(messageData);
      if (res?.success) {
        handleInputChange("");
        stopTypingEvent();
        const formattedMessage = groupMessagesByDate(res?.data);
        dispatch(SET_CONVERSATION(formattedMessage));
      }
    } catch (error) {
      console.log({ error });
      showToast(FAILED, COMMON_ERROR_MESSAGE);
    }
  };

  return (
    <>
      <Paper
        component="form"
        sx={{
          p: "2px 0px",
          display: "flex",
          alignItems: "center",
          border: "1px solid gray",
        }}
      >
        <IconButton
          onClick={(e) => {
            dispatch(SET_EMOJI_ANCHOR_EL(e.currentTarget));
            dispatch(SET_EMOJI_STATUS(!isEmojiOpen));
            dispatch(SET_ONE_ICON(false));
          }}
          sx={{ p: "10px" }}
          aria-label="menu"
        >
          <AddIcon />
        </IconButton>
        <InputBase
          onChange={(e: any) => {
            handleInputChange(e.target.value);
          }}
          value={message}
          sx={{ ml: 1, flex: 1 }}
          placeholder="Type a message"
          inputProps={{ "aria-label": "search google maps" }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (message) {
                handleClick();
              }
            }
          }}
        />
        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
        <IconButton
          onClick={handleClick}
          color="primary"
          sx={{ p: "10px" }}
          aria-label="directions"
          disabled={!message}
        >
          <SendIcon />
        </IconButton>
      </Paper>

      <EmojiPicker
        onEmojiChanges={(e: any) => handleInputChange((prev: any) => prev + e)}
      />
    </>
  );
}
