/* eslint-disable @typescript-eslint/no-explicit-any */
import Menu from "@mui/material/Menu";
import ReplyIcon from "@mui/icons-material/Reply";
import { Box, Stack, Typography } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import EditIcon from "@mui/icons-material/Edit";
import { RootState } from "../../redux/store";
import {
  DELETE_MESSAGE,
  SET_EDITED_MESSAGE,
} from "../../redux/features/chat/getConversationSlice";
import { deleteMessage } from "../../services/message";

const myActions = [
  {
    id: 34442,
    title: "Edit",
    icon: <EditIcon />,
  },
  {
    id: 1444,
    title: "Delete",
    icon: <DeleteIcon />,
  },
];
const config = [
  {
    id: 1,
    title: "Reply",
    icon: <ReplyIcon />,
  },
  {
    id: 34442,
    title: "Copy",
    icon: <ContentCopyIcon />,
  },

  {
    id: 3341,
    title: "React",
    icon: <InsertEmoticonIcon />,
  },
  {
    id: 134,
    title: "Forward",
    icon: <ArrowForwardIcon />,
  },
];
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
  const handleClose = () => {
    setMoreActionAnchorEl(null);
    setMoreActionOpen(false);
  };
  const handleDeleteMessage = async () => {
    try {
      const res = await deleteMessage(mess);
      if (res?.success) {
        dispatch(DELETE_MESSAGE(res?.data));
      }
      handleClose();
    } catch (error) {
      console.log(error);
    }
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
        setMoreActionOpen(false);
        break;
      case "Delete":
        handleDeleteMessage();
        break;
      case "Reply":
        console.log(v);
        break;
      case "Copy":
        navigator.clipboard.writeText(mess?.text);
        setMoreActionOpen(false);
        break;
      case "Forward":
        console.log(v);
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
        {(mess?.senderId === myId ? [...config, ...myActions] : config).map(
          (c) => (
            <CCard c={c} handleClick={handleClick}>
              Profile
            </CCard>
          )
        )}
      </Menu>
    </>
  );
}
