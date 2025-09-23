import EditIcon from "@mui/icons-material/Edit";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DeleteIcon from "@mui/icons-material/Delete";
import ReplyIcon from "@mui/icons-material/Reply";
export const moreActionsConfig = [
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
export const moreActionsConfigMyActions = [
  ...moreActionsConfig,
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
