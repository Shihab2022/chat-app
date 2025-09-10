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
      <Box sx={{ minWidth: "200px" }}>
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
        id="basic-menu"
        anchorEl={moreAnchorEl}
        open={moreActionOpen}
        onClose={handleClose}
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
