import { useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import { createGroupAPI } from "../../services/message";
import { TUser } from "../../types";
import { showToast } from "../../utils/toast";
import { COMMON_ERROR_MESSAGE, FAILED } from "../../constants/common";

interface CreateGroupDialogProps {
  users: TUser[];
  friendIds?: string[];
  open: boolean;
  onClose: () => void;
  onCreated: (group?: TUser) => void;
}

export default function CreateGroupDialog({
  users,
  friendIds = [],
  open,
  onClose,
  onCreated,
}: CreateGroupDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [inviteEmails, setInviteEmails] = useState("");
  const [saving, setSaving] = useState(false);

  const visibleUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return (users || []).filter((user) => {
      if (!query) return true;
      return `${user.name || ""} ${user.email || ""}`
        .toLowerCase()
        .includes(query);
    });
  }, [users, search]);

  const handleClose = () => {
    if (saving) return;
    setName("");
    setDescription("");
    setSelectedIds([]);
    setSearch("");
    setInviteEmails("");
    onClose();
  };

  const handleCreate = async () => {
    if (!name.trim() || (selectedIds.length === 0 && !inviteEmails.trim())) return;
    setSaving(true);

    try {
      const response = await createGroupAPI({
        name: name.trim(),
        description: description.trim(),
        emails: [...selectedIds.map((id) => users.find((user) => String(user.id) === id)?.email), ...inviteEmails.split(",")]
          .filter(Boolean).map((email) => String(email).trim()),
      });

      const groupId = response?.data?.id;
      if (!response?.success || !groupId) {
        showToast(FAILED, response?.message || COMMON_ERROR_MESSAGE);
        return;
      }

      const createdGroup = {
        ...response.data,
        id: String(groupId),
        isGroup: true,
        img: "",
        members: response.data?.members || [],
      } as TUser;

      setName("");
      setDescription("");
      setSelectedIds([]);
      setSearch("");
      setInviteEmails("");
      onCreated(createdGroup);
      onClose();
    } catch (error) {
      console.error("Group creation failed:", error);
      showToast(FAILED, COMMON_ERROR_MESSAGE);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <GroupAddIcon color="primary" /> Create a group
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          label="Group name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          margin="dense"
        />
        <TextField
          fullWidth
          label="Invite by email"
          helperText="Separate multiple email addresses with commas. Invitations must be accepted before people join."
          value={inviteEmails}
          onChange={(event) => setInviteEmails(event.target.value)}
          margin="dense"
        />
        <TextField
          fullWidth
          label="Description (optional)"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          margin="dense"
        />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mt: 1.5,
            px: 1.25,
            borderRadius: 2,
            backgroundColor: (theme) => theme.palette.action.hover,
          }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder="Search registered users..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            variant="standard"
            slotProps={{ input: { disableUnderline: true } }}
          />
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
          <PersonAddAltOutlinedIcon
            sx={{ fontSize: 14, verticalAlign: "middle", mr: 0.5 }}
          />
          You can add any registered user, even if they are not your friend yet.
        </Typography>

        <List dense sx={{ maxHeight: 260, overflowY: "auto", mt: 1 }}>
          {visibleUsers.map((user) => {
            const id = String(user.id);
            const isFriend = friendIds.includes(id);
            return (
              <ListItem key={id} disablePadding>
                <FormControlLabel
                  sx={{ width: "100%", m: 0 }}
                  control={
                    <Checkbox
                      checked={selectedIds.includes(id)}
                      onChange={() =>
                        setSelectedIds((current) =>
                          current.includes(id)
                            ? current.filter((item) => item !== id)
                            : [...current, id],
                        )
                      }
                    />
                  }
                  label={
                    <ListItemText
                      primary={
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <span>{user.name}</span>
                          {isFriend ? (
                            <Chip label="Friend" size="small" color="primary" variant="outlined" />
                          ) : (
                            <Chip label="New" size="small" color="secondary" variant="outlined" />
                          )}
                        </Box>
                      }
                      secondary={user.email}
                    />
                  }
                />
                <ListItemAvatar sx={{ minWidth: 42 }}>
                  <Avatar src={user.img}>{user.name?.[0]}</Avatar>
                </ListItemAvatar>
              </ListItem>
            );
          })}
          {visibleUsers.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: "center" }}>
              No registered users found.
            </Typography>
          )}
        </List>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleCreate}
          disabled={saving || !name.trim() || (selectedIds.length === 0 && !inviteEmails.trim())}
        >
          {saving ? "Creating..." : "Create group"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
