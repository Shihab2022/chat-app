/* eslint-disable @typescript-eslint/no-explicit-any */
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import SendIcon from "@mui/icons-material/Send";
import { showToast } from "../utils/toast";
import { COMMON_ERROR_MESSAGE, FAILED } from "../constants/common";
import { useState } from "react";
import { sendMessage } from "../services/message";
import { useDispatch, useSelector } from "react-redux";
import { SET_CONVERSATION } from "../redux/features/chat/getConversationSlice";
import { RootState } from "../redux/store";
export default function SearchField({ myId }: { myId: string }) {
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const { receiverId } = useSelector((state: RootState) => state?.message);
  const handleClick = async () => {
    const messageData = {
      senderId: myId,
      receiverId: receiverId,
      text: message,
    };

    try {
      const res = await sendMessage(messageData);
      if (res?.success) {
        setMessage("");
        dispatch(SET_CONVERSATION(res?.data));
      }
    } catch (error) {
      console.log({ error });
      showToast(FAILED, COMMON_ERROR_MESSAGE);
    }
  };

  return (
    <Paper
      component="form"
      sx={{
        p: "2px 0px",
        display: "flex",
        alignItems: "center",
        border: "1px solid gray",
      }}
    >
      <IconButton sx={{ p: "10px" }} aria-label="menu">
        <AddIcon />
      </IconButton>
      <InputBase
        onChange={(e: any) => setMessage(e.target.value)}
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
  );
}
