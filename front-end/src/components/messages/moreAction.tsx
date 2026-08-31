/* eslint-disable @typescript-eslint/no-explicit-any */
import Menu from "@mui/material/Menu";
import { Box, ListItemIcon, Stack, Typography, alpha, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import {
  SET_EDITED_MESSAGE,
  SET_REPLIED_MESSAGE,
} from "../../redux/features/chat/conversationSlice";
import { useState } from "react";
import DeleteConformations from "./deleteConformations";
import { moreActionsConfig, moreActionsConfigMyActions } from "../../config";
import ForwardMessage from "./forwardMessage";
import { PURPLE_PRIMARY } from "../../theme";

const CCard = ({ c, handleClick }: any) => {
  const { icon, title } = c;
  const isDestructive = title === "Delete";
  return (
    <Box sx={{ minWidth: "180px" }}>
      <Stack
        direction="row"
        spacing={1.5}
        sx={{
          justifyContent: "flex-start",
          alignItems: "center",
          paddingY: "8px",
          paddingX: "12px",
          marginX: "6px",
          borderRadius: 1.5,
          cursor: "pointer",
          transition: "background-color 150ms ease",
          "&:hover": {
            backgroundColor: isDestructive ? alpha("#EF4444", 0.08) : "action.hover",
          },
        }}
        onClick={() => handleClick(title)}
      >
        <ListItemIcon
          sx={{
            minWidth: 30,
            color: isDestructive ? "#EF4444" : PURPLE_PRIMARY,
            "& .MuiSvgIcon-root": { fontSize: 19 },
          }}
        >
          {icon}
        </ListItemIcon>
        <Typography
          variant="body2"
          sx={{ fontWeight: 500, color: isDestructive ? "#EF4444" : "text.primary" }}
        >
          {title}
        </Typography>
      </Stack>
    </Box>
  );
};
export default function MoreActions({
  setMoreActionAnchorEl,
  setMoreActionOpen,
  moreActionOpen,
  moreAnchorEl,
  mess,
  setIconMenuOpen,
  setIconAnchorEl,
}: any) {
  const theme = useTheme();
  const { loginUser } = useSelector((state: RootState) => state?.auth);
  const { id: myId } = loginUser;
  const dispatch = useDispatch();
  const [deleteConformationMenuOpen, setDeleteConformationMenuOpen] =
    useState(false);
  const [forwardMenuOpen, setForwardMenuOpen] = useState(false);
  const handleClose = () => {
    setMoreActionAnchorEl(null);
    setMoreActionOpen(false);
  };

  const handleClick = (v: any) => {
    switch (v) {
      case "React":
        setIconAnchorEl(moreAnchorEl);
        setIconMenuOpen(true);
        setMoreActionOpen(false);
        break;
      case "Edit":
        dispatch(SET_EDITED_MESSAGE(mess));
        dispatch(SET_REPLIED_MESSAGE({}));
        setMoreActionOpen(false);
        break;
      case "Delete":
        setDeleteConformationMenuOpen(true);
        dispatch(SET_REPLIED_MESSAGE({}));
        dispatch(SET_EDITED_MESSAGE({}));
        handleClose();
        break;
      case "Reply":
        dispatch(SET_REPLIED_MESSAGE(mess));
        handleClose();
        break;
      case "Copy":
        navigator.clipboard.writeText(mess?.text);
        setMoreActionOpen(false);
        break;
      case "Forward":
        setForwardMenuOpen(true);
        dispatch(SET_REPLIED_MESSAGE({}));
        handleClose();
        break;
      default:
        setMoreActionAnchorEl(null);
        setMoreActionOpen(false);
    }
  };
  return (
    <>
      <Menu
        id="menu-appbar"
        anchorEl={moreAnchorEl}
        open={moreActionOpen}
        onClose={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              minWidth: "170px",
              borderRadius: 3,
              zIndex: 20,
              paddingY: "6px",
              border: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.background.paper,
              backgroundImage: "none",
              boxShadow: `0 16px 40px ${alpha(theme.palette.common.black, 0.35)}`,
            },
          },
        }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        {(String(mess?.sender_id) === String(myId)
          ? moreActionsConfigMyActions
          : moreActionsConfig
        ).map((c) => (
          <CCard key={c.title} c={c} handleClick={handleClick} />
        ))}
      </Menu>

      <DeleteConformations
        mess={mess}
        deleteConformationMenuOpen={deleteConformationMenuOpen}
        setDeleteConformationMenuOpen={setDeleteConformationMenuOpen}
      />
      <ForwardMessage
        mess={mess}
        forwardMenuOpen={forwardMenuOpen}
        setForwardMenuOpen={setForwardMenuOpen}
      />
    </>
  );
}
