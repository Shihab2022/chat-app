/* eslint-disable @typescript-eslint/no-explicit-any */
import { IconButton, Menu, Stack } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import ReplyIcon from "@mui/icons-material/Reply";
import { useState } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AddIcon from "@mui/icons-material/Add";
const MessageIcons = ({ mess, myId }: { mess: any; myId: string }) => {
  const [isIconMenuOpen, setIconMenuOpen] = useState(false);
  const [iconAnchorEl, setIconAnchorEl] = useState<null | HTMLElement>(null);
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
            <IconButton aria-label="menu">
              {" "}
              <FavoriteIcon />
            </IconButton>
            <IconButton aria-label="menu">
              {" "}
              <InsertEmoticonIcon />
            </IconButton>
            <IconButton aria-label="menu">
              {" "}
              <FavoriteIcon />
            </IconButton>
            <IconButton aria-label="menu">
              {" "}
              <InsertEmoticonIcon />
            </IconButton>
            <IconButton aria-label="menu">
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
    </>
  );
};

export default MessageIcons;
