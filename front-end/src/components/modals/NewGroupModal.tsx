/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useMemo } from "react";
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
  Avatar,
  Checkbox,
  Radio,
  RadioGroup,
  FormControlLabel,
  Stack,
  CircularProgress,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import { RootState } from "../../redux/store";
import { SET_NEW_GROUP_MODAL_OPEN } from "../../redux/features/settings/settingsSlice";
import { SET_ALL_USERS } from "../../redux/features/auth/authSlice";
import { createGroupAPI, getGroupsAPI } from "../../services/message";
import { PURPLE_PRIMARY } from "../../theme";
import { showToast } from "../../utils/toast";
import { SUCCESS, FAILED } from "../../constants/common";
import { TUser } from "../../types";

export const NewGroupModal: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { isNewGroupModalOpen } = useSelector((state: RootState) => state.settings);
  const { allUsers = [], loginUser } = useSelector((state: RootState) => state.auth);

  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [groupAvatar, setGroupAvatar] = useState<string>("");
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [groupType, setGroupType] = useState<"public" | "private">("public");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableContacts = useMemo(() => {
    return (allUsers || []).filter(
      (u: TUser) => String(u.id) !== String(loginUser?.id) && !u.isGroup
    );
  }, [allUsers, loginUser]);

  const handleClose = () => {
    dispatch(SET_NEW_GROUP_MODAL_OPEN(false));
    setGroupName("");
    setGroupDescription("");
    setGroupAvatar("");
    setSelectedParticipants([]);
    setGroupType("public");
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setGroupAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleParticipant = (userId: string) => {
    setSelectedParticipants((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleCreate = async () => {
    if (!groupName.trim()) {
      showToast(FAILED, "Please enter a group name");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await createGroupAPI({
        name: groupName.trim(),
        description: groupDescription.trim(),
        initialMemberIds: selectedParticipants.map(Number),
      });

      if (res?.success) {
        showToast(SUCCESS, "Group created successfully!");
        const refreshed = await getGroupsAPI();
        if (refreshed?.success && refreshed.data) {
          const updatedGroups = refreshed.data.map((g: any) => ({
            ...g,
            id: String(g.id),
            isGroup: true,
          }));
          dispatch(SET_ALL_USERS([...(allUsers || []).filter((u: any) => !u.isGroup), ...updatedGroups]));
        }
        handleClose();
      } else {
        showToast(FAILED, res?.message || "Failed to create group");
      }
    } catch (err) {
      console.error("Create group error:", err);
      showToast(FAILED, "Failed to create group");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={isNewGroupModalOpen}
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
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleAvatarChange}
        accept="image/*"
        style={{ display: "none" }}
      />

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
          New Group
        </Typography>

        <IconButton size="small" onClick={handleClose} sx={{ color: theme.palette.text.secondary }}>
          <CloseRoundedIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </DialogTitle>

      {/* ── Content matching PDF Page 6 ── */}
      <DialogContent sx={{ p: 2.5, overflowY: "auto", maxHeight: "80vh" }}>
        {/* Large Circular Avatar Placeholder with Dashed Purple Border */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <Box
            onClick={() => fileInputRef.current?.click()}
            sx={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              border: `2px dashed ${PURPLE_PRIMARY}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              position: "relative",
              backgroundColor: alpha(PURPLE_PRIMARY, 0.04),
              transition: "all 150ms ease",
              "&:hover": {
                backgroundColor: alpha(PURPLE_PRIMARY, 0.08),
                transform: "scale(1.04)",
              },
            }}
          >
            {groupAvatar ? (
              <Avatar src={groupAvatar} sx={{ width: "100%", height: "100%" }} />
            ) : (
              <PeopleAltOutlinedIcon sx={{ color: PURPLE_PRIMARY, fontSize: 28 }} />
            )}

            {/* Purple Plus Badge */}
            <Box
              sx={{
                position: "absolute",
                bottom: -2,
                right: -2,
                backgroundColor: PURPLE_PRIMARY,
                color: "#FFFFFF",
                borderRadius: "50%",
                width: 22,
                height: 22,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
              }}
            >
              <AddRoundedIcon sx={{ fontSize: 16 }} />
            </Box>
          </Box>
        </Box>

        {/* Group Name Input */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" sx={{ fontWeight: 600, color: theme.palette.text.primary, display: "block", mb: 0.75 }}>
            Group Name
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="Enter group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <PeopleAltOutlinedIcon sx={{ color: theme.palette.text.secondary, fontSize: 18 }} />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                fontSize: "0.85rem",
              },
            }}
          />
        </Box>

        {/* About Input */}
        <Box sx={{ mb: 2.5 }}>
          <Typography variant="caption" sx={{ fontWeight: 600, color: theme.palette.text.primary, display: "block", mb: 0.75 }}>
            About
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="Enter group description"
            value={groupDescription}
            onChange={(e) => setGroupDescription(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <InfoOutlinedIcon sx={{ color: theme.palette.text.secondary, fontSize: 18 }} />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                fontSize: "0.85rem",
              },
            }}
          />
        </Box>

        {/* Participants Section */}
        <Typography variant="caption" sx={{ fontWeight: 600, color: theme.palette.text.primary, display: "block", mb: 1 }}>
          Participants
        </Typography>

        <Stack spacing={1} sx={{ mb: 2.5, maxHeight: 180, overflowY: "auto" }}>
          {availableContacts.map((contact: TUser) => {
            const isChecked = selectedParticipants.includes(String(contact.id));
            return (
              <Box
                key={contact.id}
                onClick={() => toggleParticipant(String(contact.id))}
                sx={{
                  p: 1,
                  borderRadius: "8px",
                  border: `1px solid ${isChecked ? PURPLE_PRIMARY : theme.palette.divider}`,
                  backgroundColor: isChecked
                    ? alpha(PURPLE_PRIMARY, 0.04)
                    : theme.palette.mode === "dark"
                    ? alpha("#FFFFFF", 0.02)
                    : "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  transition: "all 150ms ease",
                  "&:hover": {
                    borderColor: PURPLE_PRIMARY,
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                  <Avatar
                    src={contact.avatar || contact.img}
                    alt={contact.name}
                    sx={{ width: 34, height: 34, fontSize: "0.8rem", backgroundColor: alpha(PURPLE_PRIMARY, 0.12), color: PURPLE_PRIMARY }}
                  >
                    {contact.name?.[0]?.toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: "0.8125rem", lineHeight: 1.2 }}>
                      {contact.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontSize: "0.7rem" }}>
                      Contact
                    </Typography>
                  </Box>
                </Box>

                <Checkbox
                  checked={isChecked}
                  size="small"
                  sx={{
                    color: theme.palette.divider,
                    "&.Mui-checked": { color: PURPLE_PRIMARY },
                    p: 0.5,
                  }}
                />
              </Box>
            );
          })}
        </Stack>

        {/* Group Type Radio Group */}
        <Typography variant="caption" sx={{ fontWeight: 600, color: theme.palette.text.primary, display: "block", mb: 0.5 }}>
          Group Type
        </Typography>

        <RadioGroup
          row
          value={groupType}
          onChange={(e) => setGroupType(e.target.value as "public" | "private")}
        >
          <FormControlLabel
            value="public"
            control={<Radio size="small" sx={{ "&.Mui-checked": { color: PURPLE_PRIMARY } }} />}
            label={<Typography variant="body2" sx={{ fontSize: "0.8125rem" }}>Public</Typography>}
          />
          <FormControlLabel
            value="private"
            control={<Radio size="small" sx={{ "&.Mui-checked": { color: PURPLE_PRIMARY } }} />}
            label={<Typography variant="body2" sx={{ fontSize: "0.8125rem" }}>Private</Typography>}
          />
        </RadioGroup>
      </DialogContent>

      {/* ── Footer Buttons matching PDF Page 6 ── */}
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
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleCreate}
          disabled={isSubmitting || !groupName.trim()}
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
          {isSubmitting ? <CircularProgress size={18} color="inherit" /> : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewGroupModal;
