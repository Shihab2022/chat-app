/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import {
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { TUser } from "../../types";
import { showToast } from "../../utils/toast";
import { SUCCESS, WARNING } from "../../constants/common";
import { forwardMessageAPI } from "../../services/message";
import UserAvatar from "../ui/UserAvatar";
import ForwardRoundedIcon from "@mui/icons-material/ForwardRounded";
import EmptyState from "../ui/EmptyState";

const ForwardMessage = ({ mess, forwardMenuOpen, setForwardMenuOpen }: any) => {
  const theme = useTheme();
  const { loginUser, allUsers } = useSelector(
    (state: RootState) => state?.auth,
  );
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [forwarding, setForwarding] = useState(false);

  const forwardableUsers = (allUsers || []).filter(
    (user: TUser) => String(user.id) !== String(loginUser?.id) && !user.isGroup,
  );

  const handleToggle = (id: string) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id],
    );
  };

  const handleClose = () => {
    setForwardMenuOpen(false);
    setSelectedUsers([]);
  };

  const handleForwardMessage = async () => {
    if (selectedUsers.length === 0) {
      showToast(
        WARNING,
        "Please select at least one user to forward the message",
      );
      return;
    }
    setForwarding(true);
    try {
      const params = {
        text: mess?.text,
        receiverIds: selectedUsers,
        sender_id: loginUser.id,
      };
      const response = await forwardMessageAPI(params);
      if (response.success) {
        showToast(SUCCESS, "Message forwarded successfully");
      } else {
        showToast(WARNING, "Failed to forward message");
      }
    } catch (error) {
      showToast(WARNING, "An error occurred while forwarding the message");
    } finally {
      setForwarding(false);
      handleClose();
    }
  };

  return (
    <Dialog
      open={forwardMenuOpen}
      onClose={forwarding ? undefined : handleClose}
      fullWidth
      maxWidth="xs"
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            border: `1px solid ${theme.palette.divider}`,
            backgroundImage: "none",
          },
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 700, pb: 0.5 }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <ForwardRoundedIcon fontSize="small" color="primary" />
          <span>Forward message</span>
        </Stack>
      </DialogTitle>
      <Typography variant="body2" color="text.secondary" sx={{ px: 3, pb: 1 }}>
        Select one or more conversations to forward this message to.
      </Typography>

      <DialogContent dividers sx={{ px: 1.5, py: 1 }}>
        {forwardableUsers.length === 0 ? (
          <EmptyState
            compact
            title="No one to forward to"
            description="Invite friends to Chatty first, then you can forward messages to them."
          />
        ) : (
          forwardableUsers.map((user: TUser) => {
            const { id, name, img } = user;
            const isSelected = selectedUsers.includes(String(id));
            return (
              <Stack
                key={id}
                direction="row"
                onClick={() => handleToggle(String(id))}
                sx={{
                  justifyContent: "space-between",
                  alignItems: "center",
                  px: 1.5,
                  py: 1,
                  mb: 0.5,
                  borderRadius: 2,
                  cursor: "pointer",
                  transition: "background-color 150ms ease",
                  backgroundColor: isSelected
                    ? alpha(theme.palette.primary.main, 0.1)
                    : "transparent",
                  border: `1px solid ${isSelected ? alpha(theme.palette.primary.main, 0.35) : "transparent"}`,
                  "&:hover": { backgroundColor: theme.palette.action.hover },
                }}
              >
                <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", minWidth: 0 }}>
                  <UserAvatar img={img} name={name || "User"} size={38} />
                  <Typography
                    component="div"
                    variant="body2"
                    noWrap
                    sx={{ fontWeight: isSelected ? 600 : 500 }}
                  >
                    {name}
                  </Typography>
                </Stack>
                <Checkbox
                  edge="end"
                  checked={isSelected}
                  onChange={() => handleToggle(String(id))}
                  onClick={(e) => e.stopPropagation()}
                  slotProps={{ input: { "aria-label": `Forward to ${name}` } }}
                />
              </Stack>
            );
          })
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose} disabled={forwarding}>
          Cancel
        </Button>
        <Button
          onClick={handleForwardMessage}
          variant="contained"
          disabled={forwarding || selectedUsers.length === 0}
          startIcon={
            forwarding ? <CircularProgress size={16} color="inherit" /> : undefined
          }
        >
          {forwarding
            ? "Forwarding…"
            : `Forward${selectedUsers.length ? ` (${selectedUsers.length})` : ""}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ForwardMessage;

