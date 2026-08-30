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
  Badge,
  Divider,
  Stack,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import LinkRoundedIcon from "@mui/icons-material/LinkRounded";

import { RootState } from "../../redux/store";
import {
  SET_CONTACT_DETAIL_MODAL,
  SET_ACTIVE_NAV_TAB,
} from "../../redux/features/settings/settingsSlice";
import { SET_RECEIVER_ID } from "../../redux/features/chat/conversationSlice";
import { PURPLE_PRIMARY, STATUS_ONLINE } from "../../theme";

export const ContactDetailModal: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const { isContactDetailModalOpen, selectedContactForDetail } = useSelector(
    (state: RootState) => state.settings
  );

  if (!isContactDetailModalOpen || !selectedContactForDetail) {
    return null;
  }

  const contact = selectedContactForDetail;

  const handleClose = () => {
    dispatch(SET_CONTACT_DETAIL_MODAL({ open: false }));
  };

  const handleStartChat = () => {
    dispatch(SET_RECEIVER_ID(String(contact.id)));
    dispatch(SET_ACTIVE_NAV_TAB("chats"));
    handleClose();
  };

  const personalInfo = [
    { label: "Local Time", value: contact.localTime || "—", icon: AccessTimeRoundedIcon },
    { label: "Date of Birth", value: contact.dob || contact.date_of_birth || "—", icon: CalendarTodayOutlinedIcon },
    { label: "Phone Number", value: contact.phone || "—", icon: PhoneOutlinedIcon },
    { label: "Email", value: contact.email || "—", icon: MailOutlineRoundedIcon },
    { label: "Website Address", value: contact.website || "—", icon: LanguageRoundedIcon },
    { label: "Status", value: contact.status || contact.bio || "—", icon: ChatOutlinedIcon },
    { label: "Last Seen", value: contact.lastSeen || (contact.isOnline ? "Online now" : "Offline"), icon: RemoveRedEyeOutlinedIcon },
  ];

  return (
    <Dialog
      open={isContactDetailModalOpen}
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
      {/* ── Header ── */}
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
          Contact Detail
        </Typography>

        <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
          <IconButton size="small" sx={{ color: theme.palette.text.secondary }}>
            <MoreVertRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <IconButton size="small" onClick={handleClose} sx={{ color: theme.palette.text.secondary }}>
            <CloseRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Stack>
      </DialogTitle>

      {/* ── Modal Content ── */}
      <DialogContent sx={{ p: 2.5, overflowY: "auto", maxHeight: "80vh" }}>
        {/* Top Profile Card matching PDF Page 4 */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
              sx={{
                "& .MuiBadge-badge": {
                  backgroundColor: STATUS_ONLINE,
                  boxShadow: "0 0 0 2px #FFFFFF",
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                },
              }}
            >
              <Avatar
                src={contact.avatar || contact.img}
                alt={contact.name}
                sx={{
                  width: 50,
                  height: 50,
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  backgroundColor: alpha(PURPLE_PRIMARY, 0.15),
                  color: PURPLE_PRIMARY,
                }}
              >
                {contact.name?.[0]?.toUpperCase()}
              </Avatar>
            </Badge>

            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: "0.95rem", lineHeight: 1.2 }}>
                {contact.name}
              </Typography>
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                {contact.role || "Frontend engineer"}
              </Typography>
            </Box>
          </Box>

          {/* Square Outline Quick Action Buttons */}
          <Stack direction="row" spacing={1}>
            <IconButton
              size="small"
              onClick={handleStartChat}
              sx={{
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: "8px",
                width: 34,
                height: 34,
                color: theme.palette.text.secondary,
                "&:hover": {
                  borderColor: PURPLE_PRIMARY,
                  color: PURPLE_PRIMARY,
                  backgroundColor: alpha(PURPLE_PRIMARY, 0.05),
                },
              }}
            >
              <ChatBubbleOutlineRoundedIcon sx={{ fontSize: 16 }} />
            </IconButton>

            <IconButton
              size="small"
              sx={{
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: "8px",
                width: 34,
                height: 34,
                color: theme.palette.text.secondary,
                "&:hover": {
                  borderColor: PURPLE_PRIMARY,
                  color: PURPLE_PRIMARY,
                  backgroundColor: alpha(PURPLE_PRIMARY, 0.05),
                },
              }}
            >
              <LocalPhoneOutlinedIcon sx={{ fontSize: 16 }} />
            </IconButton>

            <IconButton
              size="small"
              sx={{
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: "8px",
                width: 34,
                height: 34,
                color: theme.palette.text.secondary,
                "&:hover": {
                  borderColor: PURPLE_PRIMARY,
                  color: PURPLE_PRIMARY,
                  backgroundColor: alpha(PURPLE_PRIMARY, 0.05),
                },
              }}
            >
              <VideocamOutlinedIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Stack>
        </Box>

        {/* Section: Personal Information */}
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 700,
            fontSize: "0.85rem",
            color: theme.palette.text.primary,
            mb: 1.5,
          }}
        >
          Personal Information
        </Typography>

        <Box sx={{ mb: 3 }}>
          {personalInfo.map((row, idx) => {
            const Icon = row.icon;
            return (
              <React.Fragment key={row.label}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    py: 0.85,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Icon sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontSize: "0.78rem" }}>
                      {row.label}
                    </Typography>
                  </Box>

                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 600,
                      fontSize: "0.78rem",
                      color: theme.palette.text.primary,
                    }}
                  >
                    {row.value}
                  </Typography>
                </Box>
                {idx < personalInfo.length - 1 && <Divider sx={{ my: 0.25, borderColor: alpha(theme.palette.divider, 0.6) }} />}
              </React.Fragment>
            );
          })}
        </Box>

        {/* Section: Shared Content */}
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 700,
            fontSize: "0.85rem",
            color: theme.palette.text.primary,
            mb: 1.5,
          }}
        >
          Shared Content
        </Typography>

        <Stack direction="row" spacing={1.5}>
          {/* Media Card */}
          <Box
            sx={{
              flex: 1,
              p: 1.5,
              borderRadius: "10px",
              border: `1px solid ${theme.palette.divider}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 0.5,
              backgroundColor: theme.palette.mode === "dark" ? alpha("#FFFFFF", 0.02) : "#FFFFFF",
            }}
          >
            <ImageOutlinedIcon sx={{ fontSize: 20, color: theme.palette.text.secondary }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: "0.95rem" }}>
              0
            </Typography>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontSize: "0.72rem" }}>
              Media
            </Typography>
          </Box>

          {/* Files Card */}
          <Box
            sx={{
              flex: 1,
              p: 1.5,
              borderRadius: "10px",
              border: `1px solid ${theme.palette.divider}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 0.5,
              backgroundColor: theme.palette.mode === "dark" ? alpha("#FFFFFF", 0.02) : "#FFFFFF",
            }}
          >
            <InsertDriveFileOutlinedIcon sx={{ fontSize: 20, color: theme.palette.text.secondary }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: "0.95rem" }}>
              0
            </Typography>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontSize: "0.72rem" }}>
              Files
            </Typography>
          </Box>

          {/* Links Card */}
          <Box
            sx={{
              flex: 1,
              p: 1.5,
              borderRadius: "10px",
              border: `1px solid ${theme.palette.divider}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 0.5,
              backgroundColor: theme.palette.mode === "dark" ? alpha("#FFFFFF", 0.02) : "#FFFFFF",
            }}
          >
            <LinkRoundedIcon sx={{ fontSize: 20, color: theme.palette.text.secondary }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: "0.95rem" }}>
              0
            </Typography>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontSize: "0.72rem" }}>
              Links
            </Typography>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default ContactDetailModal;
