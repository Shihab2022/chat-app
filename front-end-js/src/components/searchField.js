import * as React from "react";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import SendIcon from "@mui/icons-material/Send";
export default function SearchField() {
  return (
    <Paper
      component="form"
      sx={{
        p: "2px 0px",
        display: "flex",
        alignItems: "center",
        border: "1px solid red",
      }}
    >
      <IconButton sx={{ p: "10px" }} aria-label="menu">
        <AddIcon />
      </IconButton>
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Ab"
        inputProps={{ "aria-label": "search google maps" }}
      />
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <IconButton color="primary" sx={{ p: "10px" }} aria-label="directions">
        <SendIcon />
      </IconButton>
    </Paper>
  );
}
