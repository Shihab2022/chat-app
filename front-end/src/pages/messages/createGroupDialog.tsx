import { useState } from "react";
import {
  Avatar,
  Button,
  Checkbox,
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
} from "@mui/material";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import { createGroupAPI, addGroupMemberAPI } from "../../services/message";
import { TUser } from "../../types";
import { showToast } from "../../utils/toast";
import { COMMON_ERROR_MESSAGE, FAILED } from "../../constants/common";

interface CreateGroupDialogProps {
  friends: TUser[];
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export default function CreateGroupDialog({
  friends,
  open,
  onClose,
  onCreated,
}: CreateGroupDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const handleClose = () => {
    if (saving) return;
    setName("");
    setDescription("");
    setSelectedIds([]);
    onClose();
  };

  const handleCreate = async () => {
    if (!name.trim() || selectedIds.length === 0) return;
    setSaving(true);
    try {
      const response = await createGroupAPI({
        name: name.trim(),
        description: description.trim(),
      });
      const groupId = response?.data?.id;
      if (response?.success && groupId) {
        const memberResponses = await Promise.all(
          selectedIds.map((userId) =>
            addGroupMemberAPI(groupId, { userIdToAdd: Number(userId) }),
          ),
        );
        if (memberResponses.every((memberResponse) => memberResponse?.success)) {
          setName("");
          setDescription("");
          setSelectedIds([]);
          onCreated();
        }
      }
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
          label="Description (optional)"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          margin="dense"
        />
        <List dense sx={{ maxHeight: 260, overflowY: "auto", mt: 1 }}>
          {friends.map((friend) => {
            const id = String(friend.id);
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
                      primary={friend.name}
                      secondary={friend.email}
                    />
                  }
                />
                <ListItemAvatar sx={{ minWidth: 42 }}>
                  <Avatar src={friend.img}>{friend.name?.[0]}</Avatar>
                </ListItemAvatar>
              </ListItem>
            );
          })}
        </List>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleCreate}
          disabled={saving || !name.trim() || selectedIds.length === 0}
        >
          {saving ? "Creating..." : "Create group"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
