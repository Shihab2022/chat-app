import React, { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  Avatar,
  Badge,
  Stack,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

import { RootState } from "../../redux/store";
import { SET_NEW_CHAT_MODAL_OPEN } from "../../redux/features/settings/settingsSlice";
import { SET_RECEIVER_ID } from "../../redux/features/chat/conversationSlice";
import { PURPLE_PRIMARY, STATUS_ONLINE } from "../../theme";
import { TUser } from "../../types";

export const NewChatModal: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const { isNewChatModalOpen } = useSelector((state: RootState) => state.settings);
  const { allUsers = [], activeUsers = [], loginUser } = useSelector(
    (state: RootState) => state.auth
  );

  const [searchQuery, setSearchQuery] = useState("");

  const availableContacts = useMemo(() => {
    return (allUsers || []).filter(
      (u: TUser) => String(u.id) !== String(loginUser?.id) && !u.isGroup
    );
  }, [allUsers, loginUser]);

  const filteredContacts = useMemo(() => {
    return availableContacts.filter((c: TUser) => {
      if (!searchQuery.trim()) return true;
      return (
        c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.role?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [availableContacts, searchQuery]);

  const handleClose = () => {
    dispatch(SET_NEW_CHAT_MODAL_OPEN(false));
    setSearchQuery("");
  };

  const handleSelectContact = (userId: string) => {
    dispatch(SET_RECEIVER_ID(userId));
    handleClose();
  };

  return (
    <Dialog
      open={isNewChatModalOpen}
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
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.05rem" }}>
          New Chat
        </Typography>

        <IconButton size="small" onClick={handleClose} sx={{ color: theme.palette.text.secondary }}>
          <CloseRoundedIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ p: 2.5 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search contacts"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon sx={{ color: theme.palette.text.secondary, fontSize: 18 }} />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              fontSize: "0.85rem",
            },
          }}
        />

        <Typography variant="caption" sx={{ fontWeight: 700, color: theme.palette.text.secondary, display: "block", mb: 1 }}>
          Contacts ({filteredContacts.length})
        </Typography>

        <Stack spacing={1} sx={{ maxHeight: 320, overflowY: "auto" }}>
          {filteredContacts.map((contact: TUser) => {
            const isOnline = contact.isOnline || activeUsers.includes(String(contact.id));
            return (
              <Box
                key={contact.id}
                onClick={() => handleSelectContact(String(contact.id))}
                sx={{
                  p: 1.25,
                  borderRadius: "10px",
                  border: `1px solid ${theme.palette.divider}`,
                  backgroundColor: theme.palette.mode === "dark" ? alpha("#FFFFFF", 0.02) : "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  cursor: "pointer",
                  transition: "all 150ms ease",
                  "&:hover": {
                    borderColor: PURPLE_PRIMARY,
                    backgroundColor: alpha(PURPLE_PRIMARY, 0.04),
                  },
                }}
              >
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  variant={isOnline ? "dot" : "standard"}
                  sx={{
                    flexShrink: 0,
                    "& .MuiBadge-badge": {
                      backgroundColor: STATUS_ONLINE,
                      boxShadow: "0 0 0 2px #FFFFFF",
                      width: 9,
                      height: 9,
                      borderRadius: "50%",
                    },
                  }}
                >
                  <Avatar
                    src={contact.avatar || contact.img}
                    alt={contact.name}
                    sx={{
                      width: 40,
                      height: 40,
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      backgroundColor: alpha(PURPLE_PRIMARY, 0.12),
                      color: PURPLE_PRIMARY,
                    }}
                  >
                    {contact.name?.[0]?.toUpperCase()}
                  </Avatar>
                </Badge>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography noWrap variant="subtitle2" sx={{ fontWeight: 600, fontSize: "0.85rem" }}>
                    {contact.name}
                  </Typography>
                  <Typography noWrap variant="caption" sx={{ color: theme.palette.text.secondary, display: "block" }}>
                    {contact.role || "Contact"}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default NewChatModal;
