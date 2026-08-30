import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Avatar,
  Stack,
  Button,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import UnarchiveRoundedIcon from "@mui/icons-material/UnarchiveRounded";
import ArchiveRoundedIcon from "@mui/icons-material/ArchiveRounded";

import { RootState } from "../../redux/store";
import { SET_ARCHIVED_CHATS_OPEN } from "../../redux/features/settings/settingsSlice";
import { SET_RECEIVER_ID } from "../../redux/features/chat/conversationSlice";
import { PURPLE_PRIMARY } from "../../theme";
import { showToast } from "../../utils/toast";
import { SUCCESS } from "../../constants/common";

export const ArchivedChatsModal: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const { isArchivedChatsOpen } = useSelector((state: RootState) => state.settings);

  const archivedList: { id: string; name: string; lastMessage: string; time: string }[] = [];

  const handleClose = () => {
    dispatch(SET_ARCHIVED_CHATS_OPEN(false));
  };

  const handleUnarchive = (id: string, name: string) => {
    showToast(SUCCESS, `"${name}" unarchived.`);
    dispatch(SET_RECEIVER_ID(id));
    handleClose();
  };

  return (
    <Dialog
      open={isArchivedChatsOpen}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: "16px",
            p: 0,
            overflow: "hidden",
            backgroundColor: theme.palette.mode === "dark" ? theme.palette.background.paper : "#FFFFFF",
            boxShadow: "0 10px 40px rgba(0,0,0,0.18)",
          },
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          px: 2.5,
          py: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <ArchiveRoundedIcon sx={{ color: PURPLE_PRIMARY, fontSize: 20 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.05rem" }}>
            Archived Chats
          </Typography>
        </Box>

        <IconButton size="small" onClick={handleClose} sx={{ color: theme.palette.text.secondary }}>
          <CloseRoundedIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ p: 2.5 }}>
        {archivedList.length === 0 ? (
          <Box sx={{ py: 4, textAlign: "center" }}>
            <ArchiveRoundedIcon sx={{ fontSize: 40, color: theme.palette.text.disabled, mb: 1 }} />
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
              No archived chats yet.
            </Typography>
          </Box>
        ) : (
        <Stack spacing={1.5}>
          {archivedList.map((item) => (
            <Box
              key={item.id}
              sx={{
                p: 1.5,
                borderRadius: "10px",
                border: `1px solid ${theme.palette.divider}`,
                backgroundColor: theme.palette.mode === "dark" ? alpha("#FFFFFF", 0.02) : "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1.5,
              }}
            >
              <Avatar sx={{ width: 40, height: 40, backgroundColor: alpha(PURPLE_PRIMARY, 0.12), color: PURPLE_PRIMARY }}>
                {item.name[0]}
              </Avatar>

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography noWrap variant="subtitle2" sx={{ fontWeight: 600, fontSize: "0.85rem" }}>
                  {item.name}
                </Typography>
                <Typography noWrap variant="caption" sx={{ color: theme.palette.text.secondary, display: "block" }}>
                  {item.lastMessage}
                </Typography>
              </Box>

              <Button
                size="small"
                variant="outlined"
                onClick={() => handleUnarchive(item.id, item.name)}
                startIcon={<UnarchiveRoundedIcon sx={{ fontSize: 14 }} />}
                sx={{
                  fontSize: "0.72rem",
                  py: 0.4,
                  px: 1,
                  borderRadius: "6px",
                  borderColor: PURPLE_PRIMARY,
                  color: PURPLE_PRIMARY,
                }}
              >
                Unarchive
              </Button>
            </Box>
          ))}
        </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ArchivedChatsModal;
