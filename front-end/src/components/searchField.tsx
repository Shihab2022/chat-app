import * as React from "react";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import SendIcon from "@mui/icons-material/Send";
import { showToast } from "../utils/toast";
import { FAILED, SUCCESS } from "../constants/common";
export default function SearchField() {
  const [message, setMessage] = React.useState(null);
  const sendMessage = async () => {
    const messageData = {
      senderId: "65979a29bb6f04bd494e6bbb",
      receiverId: "659798b8df9f194773891c12",
      content: message,
      timestamp: new Date(),
    };

    try {
      const response = await fetch("http://localhost:5000/api/message/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageData),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      if (result.success) {
        setMessage("");
        showToast(SUCCESS, result.message);
      } else {
        showToast(FAILED, "Something is wrong ! ");
      }
    } catch (error) {}
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
        onChange={(e) => setMessage(e.target.value)}
        value={message}
        sx={{ ml: 1, flex: 1 }}
        placeholder="Ab"
        inputProps={{ "aria-label": "search google maps" }}
      />
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <IconButton
        onClick={sendMessage}
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
