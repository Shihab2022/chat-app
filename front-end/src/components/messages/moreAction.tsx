/* eslint-disable @typescript-eslint/no-explicit-any */
import Menu from "@mui/material/Menu";
import ReplyIcon from "@mui/icons-material/Reply";
import { Box, Stack, Typography } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DeleteIcon from "@mui/icons-material/Delete";

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
  {
    id: 1444,
    title: "Delete",
    icon: <DeleteIcon />,
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
}: any) {
  const handleClose = () => {
    setMoreActionAnchorEl(null);
    setMoreActionOpen(false);
  };
  const handleClick = (v: any) => {
    console.log(v);
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
        {config.map((c) => (
          <CCard c={c} onClick={handleClick}>
            Profile
          </CCard>
        ))}
      </Menu>
    </>
  );
}
