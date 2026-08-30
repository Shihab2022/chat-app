import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Tooltip,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";

import { RootState } from "../../redux/store";
import { SET_INVITE_FRIEND_MODAL_OPEN } from "../../redux/features/settings/settingsSlice";
import { inviteUserApi, getFriends } from "../../services/auth";
import { PURPLE_PRIMARY } from "../../theme";
import { showToast } from "../../utils/toast";
import { SUCCESS, FAILED } from "../../constants/common";

export const InviteFriendModal: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const { isInviteFriendModalOpen } = useSelector((state: RootState) => state.settings);

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("Hey! Let's connect on Chatty.");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);

  const handleClose = () => {
    dispatch(SET_INVITE_FRIEND_MODAL_OPEN(false));
    setEmail("");
    setMessage("Hey! Let's connect on Chatty.");
    setGeneratedLink(null);
  };

  const handleSendInvite = async () => {
    if (!email.trim() || !email.includes("@")) {
      showToast(FAILED, "Please enter a valid email address.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await inviteUserApi({ email: email.trim(), message: message.trim() });
      if (res?.success) {
        const inviteUrl = res.data?.inviteUrl;
        const emailSent = res.data?.emailSent;

        if (emailSent) {
          showToast(SUCCESS, `Invitation email sent to ${email.trim()}!`);
        } else {
          showToast(SUCCESS, `Invitation created for ${email.trim()}!`);
        }

        if (inviteUrl) {
          setGeneratedLink(inviteUrl);
        } else {
          handleClose();
        }
        void getFriends({});
      } else {
        showToast(FAILED, res?.message || "Failed to send invitation.");
      }
    } catch (err: any) {
      console.error("Invite error:", err);
      showToast(FAILED, err?.response?.data?.message || "Failed to send invitation");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyGeneratedLink = async () => {
    if (!generatedLink) return;
    try {
      await navigator.clipboard.writeText(generatedLink);
      showToast(SUCCESS, "Invitation link copied to clipboard!");
    } catch {
      showToast(FAILED, "Failed to copy link");
    }
  };

  return (
    <Dialog
      open={isInviteFriendModalOpen}
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
          Invite to Chatty
        </Typography>

        <IconButton size="small" onClick={handleClose} sx={{ color: theme.palette.text.secondary }}>
          <CloseRoundedIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ p: 2.5 }}>
        <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontSize: "0.8125rem", mb: 2 }}>
          Send an invitation to connect with your friends and colleagues on Chatty.
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" sx={{ fontWeight: 600, color: theme.palette.text.primary, display: "block", mb: 0.75 }}>
            Email Address
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="colleague@example.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <MailOutlineRoundedIcon sx={{ color: theme.palette.text.secondary, fontSize: 18 }} />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" sx={{ fontWeight: 600, color: theme.palette.text.primary, display: "block", mb: 0.75 }}>
            Personal Message (Optional)
          </Typography>
          <TextField
            fullWidth
            size="small"
            multiline
            rows={2}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </Box>

        {generatedLink && (
          <Alert severity="success" sx={{ borderRadius: "8px", fontSize: "0.8rem", mb: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, display: "block" }}>
              Invitation Link Generated:
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
              <Typography variant="caption" noWrap sx={{ fontFamily: "monospace", flex: 1 }}>
                {generatedLink}
              </Typography>
              <Tooltip title="Copy Link">
                <IconButton size="small" onClick={handleCopyGeneratedLink} sx={{ color: PURPLE_PRIMARY }}>
                  <ContentCopyRoundedIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
            </Box>
          </Alert>
        )}
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ px: 2.5, pb: 2.5, pt: 1, gap: 1.5 }}>
        <Button
          variant="outlined"
          onClick={handleClose}
          sx={{
            flex: 1,
            py: 0.85,
            borderRadius: "8px",
            borderColor: PURPLE_PRIMARY,
            color: PURPLE_PRIMARY,
            fontSize: "0.8125rem",
            fontWeight: 600,
            "&:hover": {
              borderColor: "#6D28D9",
              backgroundColor: alpha(PURPLE_PRIMARY, 0.05),
            },
          }}
        >
          {generatedLink ? "Done" : "Cancel"}
        </Button>

        <Button
          variant="contained"
          onClick={handleSendInvite}
          disabled={isSubmitting || !email.trim()}
          startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : <SendRoundedIcon sx={{ fontSize: 16 }} />}
          sx={{
            flex: 1,
            py: 0.85,
            borderRadius: "8px",
            backgroundColor: PURPLE_PRIMARY,
            color: "#FFFFFF",
            fontSize: "0.8125rem",
            fontWeight: 600,
            "&:hover": { backgroundColor: "#6D28D9" },
          }}
        >
          {isSubmitting ? "Sending..." : "Send Invite"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InviteFriendModal;
