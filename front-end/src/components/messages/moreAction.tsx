/* eslint-disable @typescript-eslint/no-explicit-any */
import Menu from "@mui/material/Menu";
import { Box, Stack, Typography } from "@mui/material";
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

const CCard = ({ c, handleClick }: any) => {
  const { icon, title } = c;
  return (
    <>
      <Box sx={{ minWidth: "150px" }}>
        <Stack
          direction="row"
          spacing={1}
          sx={{
            justifyContent: "flex-start",
            alignItems: "center",
            paddingY: "10px",
            paddingX: "15px",
            cursor: "pointer",
          }}
          onClick={() => handleClick(title)}
        >
          {icon}
          <Typography>{title}</Typography>
        </Stack>
      </Box>
    </>
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
  const { loginUser } = useSelector((state: RootState) => state?.auth);
  const { _id: myId } = loginUser;
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
        PaperProps={{
          sx: {
            minWidth: "150px",
            borderRadius: "5px",
            zIndex: 20,
            backgroundColor: "white",
            paddingY: "10px",
            border: "1px solid rgba(0, 0, 0, 0.1)",
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
        {(mess?.senderId === myId
          ? moreActionsConfigMyActions
          : moreActionsConfig
        ).map((c) => (
          <CCard c={c} handleClick={handleClick}>
            Profile
          </CCard>
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
