/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import {
  ContentCopyRounded,
  ReplyRounded,
  DeleteRounded,
  ForwardRounded,
} from "@mui/icons-material";

interface ChatActionMenuProps {
  onDelete?: () => void;
  onForward?: () => void;
}

export default function ChatActionMenu({ onDelete, onForward }: ChatActionMenuProps) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const items = [
    { label: "Reply", icon: <ReplyRounded fontSize="small" /> },
    { label: "Copy", icon: <ContentCopyRounded fontSize="small" /> },
    { label: "Forward", icon: <ForwardRounded fontSize="small" />, action: onForward },
    { label: "Delete", icon: <DeleteRounded fontSize="small" />, action: onDelete, destructive: true },
  ];

  return (
    <>
      <Tooltip title="More" arrow>
        <IconButton
          size="small"
          onClick={handleOpen}
          aria-label="more actions"
          aria-controls={open ? "chat-actions-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open}
          sx={{
            color: theme.palette.text.secondary,
            borderRadius: 1.5,
            "&:hover": { backgroundColor: theme.palette.action.hover },
          }}
        >
          <MoreVertRoundedIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Menu
        id="chat-actions-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            "aria-labelledby": "chat-actions-menu-button",
            onMouseDown: (e: React.MouseEvent) => e.stopPropagation(),
          },
          paper: {
            elevation: 0,
            sx: {
              minWidth: 200,
              borderRadius: 2,
              py: 1,
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: `0 12px 28px ${alpha(theme.palette.common.black, 0.18)}`,
            },
          },
        }}
        transformOrigin={{ vertical: "bottom", horizontal: "right" }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        {items.map((item) => (
          <MenuItem
            key={item.label}
            onClick={() => {
              item.action?.();
              handleClose();
            }}
            sx={{
              mx: 1,
              borderRadius: 1.5,
              pr: 1.5,
              color: item.destructive ? theme.palette.error.main : "inherit",
              "&:focus-visible": { outline: `2px solid ${theme.palette.primary.main}` },
            }}
          >
            <ListItemIcon sx={{ minWidth: 32, color: "inherit" }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} slotProps={{ primary: { variant: "body2" } }} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
