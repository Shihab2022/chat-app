/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  IconButton,
  Avatar,
  Divider,
  Stack,
  Button,
  TextField,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
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
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import PhotoCameraRoundedIcon from "@mui/icons-material/PhotoCameraRounded";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";
import ExitToAppRoundedIcon from "@mui/icons-material/ExitToAppRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import PersonRemoveRoundedIcon from "@mui/icons-material/PersonRemoveRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";

import { RootState } from "../../redux/store";
import {
  SET_CONTACT_DETAIL_MODAL,
  SET_ACTIVE_NAV_TAB,
} from "../../redux/features/settings/settingsSlice";
import { SET_RECEIVER_ID } from "../../redux/features/chat/conversationSlice";
import { SET_ALL_USERS } from "../../redux/features/auth/authSlice";
import {
  getGroupDetailsAPI,
  updateGroupAPI,
  leaveGroupAPI,
  deleteGroupAPI,
  removeGroupMemberAPI,
  setGroupMemberRoleAPI,
  addGroupMemberAPI,
  uploadMessageAttachmentAPI,
  getGroupsAPI,
  getConversationStatsAPI,
} from "../../services/message";
import { blockUserAPI, unblockUserAPI, getFriends } from "../../services/auth";
import { PURPLE_PRIMARY } from "../../theme";
import { showToast } from "../../utils/toast";
import { SUCCESS, FAILED } from "../../constants/common";
import { TUser } from "../../types";

export const ContactDetailModal: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { isContactDetailModalOpen, selectedContactForDetail } = useSelector(
    (state: RootState) => state.settings
  );
  const { allUsers = [], loginUser } = useSelector((state: RootState) => state.auth);

  const [groupDetails, setGroupDetails] = useState<any>(null);
  const [isLoadingGroup, setIsLoadingGroup] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [groupNameInput, setGroupNameInput] = useState("");
  const [groupDescInput, setGroupDescInput] = useState("");
  const [isUploadingGroupImg, setIsUploadingGroupImg] = useState(false);
  const [isSavingInfo, setIsSavingInfo] = useState(false);

  // Member action menu
  const [memberMenuAnchor, setMemberMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedMember, setSelectedMember] = useState<any>(null);

  // Add member dialog
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [selectedUserToAdd, setSelectedUserToAdd] = useState<string>("");
  const [isAddingMember, setIsAddingMember] = useState(false);

  // Confirmation dialogs
  const [confirmLeaveOpen, setConfirmLeaveOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [confirmBlockOpen, setConfirmBlockOpen] = useState(false);

  // Shared content statistics (media / files / links)
  const [sharedStats, setSharedStats] = useState({ media: 0, files: 0, links: 0 });
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  const contact = selectedContactForDetail;
  const isGroup = !!contact?.isGroup;
  const myId = String(loginUser?.id || "");

  // Load group details if group
  const loadGroupDetails = async () => {
    if (!contact?.id || !isGroup) return;
    try {
      setIsLoadingGroup(true);
      const res = await getGroupDetailsAPI(contact.id);
      if (res?.success && res.data) {
        setGroupDetails(res.data);
        setGroupNameInput(res.data.name || "");
        setGroupDescInput(res.data.description || "");
      }
    } catch (err) {
      console.error("Failed to load group details:", err);
    } finally {
      setIsLoadingGroup(false);
    }
    };

  // Load shared content statistics (media / files / links)
  const loadSharedStats = async () => {
    if (!contact?.id) return;
    try {
      setIsLoadingStats(true);
      const isGroupChat = !!contact.isGroup;
      const res = await getConversationStatsAPI(
        isGroupChat ? { groupId: contact.id } : { peerId: contact.id }
      );
      if (res?.success && res.data) {
        setSharedStats({
          media: res.data.media || 0,
          files: res.data.files || 0,
          links: res.data.links || 0,
        });
      }
    } catch (err) {
      console.error("Failed to load shared stats:", err);
    } finally {
      setIsLoadingStats(false);
    }
  };

  useEffect(() => {
  if (isContactDetailModalOpen && isGroup && contact?.id) {
    void loadGroupDetails();
  }
  if (contact) {
    setGroupNameInput(contact.name || "");
    setGroupDescInput(contact.description || contact.bio || "");
  }
  // Fetch shared content statistics for this conversation
  if (isContactDetailModalOpen && contact?.id) {
    void loadSharedStats();
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isContactDetailModalOpen, isGroup, contact?.id]);

  if (!isContactDetailModalOpen || !contact) {
    return null;
  }

  const membersList: any[] = groupDetails?.members || contact.members || [];
  const currentMemberRecord = membersList.find((m) => String(m.id) === myId);
  const isAdmin = currentMemberRecord?.role === "admin" || String(contact.created_by) === myId;
  const isCreator = String(groupDetails?.created_by || contact.created_by) === myId;

  // Available users to add to group
  const availableToAdd = allUsers.filter(
    (u: TUser) =>
      !u.isGroup &&
      String(u.id) !== myId &&
      !membersList.some((m) => String(m.id) === String(u.id))
  );

  const handleClose = () => {
    dispatch(SET_CONTACT_DETAIL_MODAL({ open: false }));
    setIsEditingName(false);
    setIsEditingDesc(false);
    setMemberMenuAnchor(null);
    setSelectedMember(null);
    setIsAddMemberOpen(false);
    setConfirmLeaveOpen(false);
    setConfirmDeleteOpen(false);
    setConfirmBlockOpen(false);
  };

  const handleStartChat = () => {
    dispatch(SET_RECEIVER_ID(String(contact.id)));
    dispatch(SET_ACTIVE_NAV_TAB("chats"));
    handleClose();
  };

  // Group Image Change
  const handleGroupImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !contact.id) return;

    try {
      setIsUploadingGroupImg(true);
      const uploadRes = await uploadMessageAttachmentAPI(file);
      if (uploadRes?.success && uploadRes.data?.url) {
        const imgUrl = uploadRes.data.url;
        const updateRes = await updateGroupAPI(contact.id, { img: imgUrl });
        if (updateRes?.success) {
          showToast(SUCCESS, "Group image updated!");
          setGroupDetails((prev: any) => ({ ...prev, img: imgUrl }));
          // Update Redux allUsers
          dispatch(
            SET_ALL_USERS(
              allUsers.map((u: TUser) =>
                String(u.id) === String(contact.id) ? { ...u, img: imgUrl, avatar: imgUrl } : u
              )
            )
          );
        } else {
          showToast(FAILED, updateRes?.message || "Failed to update group image");
        }
      } else {
        showToast(FAILED, "Failed to upload image");
      }
    } catch (err) {
      console.error("Error updating group image:", err);
      showToast(FAILED, "Failed to update group image");
    } finally {
      setIsUploadingGroupImg(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Save Group Name
  const handleSaveGroupName = async () => {
    if (!groupNameInput.trim() || !contact.id) return;
    try {
      setIsSavingInfo(true);
      const res = await updateGroupAPI(contact.id, { name: groupNameInput.trim() });
      if (res?.success) {
        showToast(SUCCESS, "Group name updated!");
        setIsEditingName(false);
        setGroupDetails((prev: any) => ({ ...prev, name: groupNameInput.trim() }));
        dispatch(
          SET_ALL_USERS(
            allUsers.map((u: TUser) =>
              String(u.id) === String(contact.id) ? { ...u, name: groupNameInput.trim() } : u
            )
          )
        );
      } else {
        showToast(FAILED, res?.message || "Failed to update group name");
      }
    } catch (err) {
      console.error("Error updating group name:", err);
      showToast(FAILED, "Failed to update group name");
    } finally {
      setIsSavingInfo(false);
    }
  };

  // Save Group Description
  const handleSaveGroupDesc = async () => {
    if (!contact.id) return;
    try {
      setIsSavingInfo(true);
      const res = await updateGroupAPI(contact.id, { description: groupDescInput.trim() });
      if (res?.success) {
        showToast(SUCCESS, "Group description updated!");
        setIsEditingDesc(false);
        setGroupDetails((prev: any) => ({ ...prev, description: groupDescInput.trim() }));
      } else {
        showToast(FAILED, res?.message || "Failed to update description");
      }
    } catch (err) {
      console.error("Error updating group description:", err);
      showToast(FAILED, "Failed to update description");
    } finally {
      setIsSavingInfo(false);
    }
  };

  // Set Role (Admin / Member)
  const handleSetRole = async (targetRole: "admin" | "member") => {
    if (!selectedMember || !contact.id) return;
    try {
      const res = await setGroupMemberRoleAPI(contact.id, selectedMember.id, targetRole);
      if (res?.success) {
        showToast(SUCCESS, `Updated ${selectedMember.name}'s role to ${targetRole}`);
        await loadGroupDetails();
      } else {
        showToast(FAILED, res?.message || "Failed to update role");
      }
    } catch (err) {
      console.error("Error setting role:", err);
      showToast(FAILED, "Failed to update member role");
    } finally {
      setMemberMenuAnchor(null);
      setSelectedMember(null);
    }
  };

  // Remove Member
  const handleRemoveMember = async () => {
    if (!selectedMember || !contact.id) return;
    try {
      const res = await removeGroupMemberAPI(contact.id, selectedMember.id);
      if (res?.success) {
        showToast(SUCCESS, `Removed ${selectedMember.name} from group`);
        await loadGroupDetails();
      } else {
        showToast(FAILED, res?.message || "Failed to remove member");
      }
    } catch (err) {
      console.error("Error removing member:", err);
      showToast(FAILED, "Failed to remove member");
    } finally {
      setMemberMenuAnchor(null);
      setSelectedMember(null);
    }
  };

  // Add Member
  const handleAddMember = async () => {
    if (!selectedUserToAdd || !contact.id) return;
    try {
      setIsAddingMember(true);
      const res = await addGroupMemberAPI(contact.id, { userIdToAdd: selectedUserToAdd });
      if (res?.success) {
        showToast(SUCCESS, "Member added successfully!");
        setIsAddMemberOpen(false);
        setSelectedUserToAdd("");
        await loadGroupDetails();
      } else {
        showToast(FAILED, res?.message || "Failed to add member");
      }
    } catch (err) {
      console.error("Error adding member:", err);
      showToast(FAILED, "Failed to add member");
    } finally {
      setIsAddingMember(false);
    }
  };

  // Leave Group
  const handleLeaveGroup = async () => {
    if (!contact.id) return;
    try {
      const res = await leaveGroupAPI(contact.id);
      if (res?.success) {
        showToast(SUCCESS, "You have left the group");
        dispatch(SET_RECEIVER_ID(""));
        const refreshed = await getGroupsAPI();
        if (refreshed?.success && refreshed.data) {
          const updatedGroups = refreshed.data.map((g: any) => ({
            ...g,
            id: String(g.id),
            isGroup: true,
          }));
          dispatch(
            SET_ALL_USERS([...allUsers.filter((u: any) => !u.isGroup), ...updatedGroups])
          );
        }
        handleClose();
      } else {
        showToast(FAILED, res?.message || "Failed to leave group");
      }
    } catch (err) {
      console.error("Error leaving group:", err);
      showToast(FAILED, "Failed to leave group");
    }
  };

  // Delete Group
  const handleDeleteGroup = async () => {
    if (!contact.id) return;
    try {
      const res = await deleteGroupAPI(contact.id);
      if (res?.success) {
        showToast(SUCCESS, "Group deleted successfully");
        dispatch(SET_RECEIVER_ID(""));
        dispatch(SET_ALL_USERS(allUsers.filter((u: TUser) => String(u.id) !== String(contact.id))));
        handleClose();
      } else {
        showToast(FAILED, res?.message || "Failed to delete group");
      }
    } catch (err) {
      console.error("Error deleting group:", err);
      showToast(FAILED, "Failed to delete group");
    }
  };

  // Block / Unblock 1-on-1 Contact
  const handleToggleBlock = async () => {
    if (!contact.id) return;
    const isCurrentlyBlocked = Boolean(contact.is_blocked || contact.isBlocked);
    try {
      const res = isCurrentlyBlocked
        ? await unblockUserAPI({ friendId: contact.id })
        : await blockUserAPI({ friendId: contact.id });
      if (res?.success) {
        showToast(SUCCESS, isCurrentlyBlocked ? "User unblocked successfully" : "User blocked");
        const nextBlocked = !isCurrentlyBlocked;
        dispatch(
          SET_ALL_USERS(
            allUsers.map((u: TUser) =>
              String(u.id) === String(contact.id)
                ? { ...u, is_blocked: nextBlocked, isBlocked: nextBlocked }
                : u
            )
          )
        );
        dispatch(
          SET_CONTACT_DETAIL_MODAL({
            open: true,
            contact: { ...contact, is_blocked: nextBlocked, isBlocked: nextBlocked },
          })
        );
        void getFriends({});
      } else {
        showToast(FAILED, res?.message || "Failed to update block status");
      }
    } catch (err) {
      console.error("Error blocking/unblocking:", err);
      showToast(FAILED, "Action failed");
    } finally {
      setConfirmBlockOpen(false);
    }
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
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleGroupImageUpload}
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
          {isGroup ? "Group Details" : "Contact Details"}
        </Typography>

        <IconButton size="small" onClick={handleClose} sx={{ color: theme.palette.text.secondary }}>
          <CloseRoundedIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </DialogTitle>

      {/* ── Modal Content ── */}
      <DialogContent sx={{ p: 2.5, overflowY: "auto", maxHeight: "80vh" }}>
        {/* Top Header Card */}
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 2.5, textAlign: "center" }}>
          <Box sx={{ position: "relative", mb: 1.5 }}>
            <Avatar
              src={groupDetails?.img || contact.img || contact.avatar}
              alt={groupDetails?.name || contact.name}
              sx={{
                width: 72,
                height: 72,
                fontSize: "1.6rem",
                fontWeight: 700,
                backgroundColor: alpha(PURPLE_PRIMARY, 0.15),
                color: PURPLE_PRIMARY,
                boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
              }}
            >
              {(groupDetails?.name || contact.name)?.[0]?.toUpperCase()}
            </Avatar>

            {/* If group & user is admin, allow photo change */}
            {isGroup && isAdmin && (
              <Tooltip title="Change Group Image">
                <IconButton
                  size="small"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingGroupImg}
                  sx={{
                    position: "absolute",
                    bottom: -4,
                    right: -4,
                    backgroundColor: PURPLE_PRIMARY,
                    color: "#FFFFFF",
                    width: 26,
                    height: 26,
                    "&:hover": { backgroundColor: "#6D28D9" },
                  }}
                >
                  {isUploadingGroupImg ? (
                    <CircularProgress size={14} color="inherit" />
                  ) : (
                    <PhotoCameraRoundedIcon sx={{ fontSize: 15 }} />
                  )}
                </IconButton>
              </Tooltip>
            )}
          </Box>

          {/* Group Name / Contact Name with Edit option */}
          {isGroup && isEditingName ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1, width: "100%" }}>
              <TextField
                size="small"
                fullWidth
                value={groupNameInput}
                onChange={(e) => setGroupNameInput(e.target.value)}
                placeholder="Group name"
              />
              <IconButton size="small" color="primary" onClick={handleSaveGroupName} disabled={isSavingInfo}>
                <CheckRoundedIcon />
              </IconButton>
              <IconButton size="small" onClick={() => setIsEditingName(false)}>
                <CloseRoundedIcon />
              </IconButton>
            </Box>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, justifyContent: "center" }}>
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.05rem", lineHeight: 1.2 }}>
                {groupDetails?.name || contact.name}
              </Typography>
              {isGroup && isAdmin && (
                <IconButton size="small" onClick={() => setIsEditingName(true)} sx={{ color: theme.palette.text.secondary }}>
                  <EditOutlinedIcon sx={{ fontSize: 16 }} />
                </IconButton>
              )}
            </Box>
          )}

          <Typography variant="caption" sx={{ color: theme.palette.text.secondary, mt: 0.25 }}>
            {isGroup ? `${membersList.length} members` : (contact.role || "Contact")}
          </Typography>
        </Box>

        {/* Action Buttons */}
        <Stack direction="row" spacing={1} sx={{ mb: 2.5, justifyContent: "center" }}>
          <Button
            variant="contained"
            size="small"
            onClick={handleStartChat}
            startIcon={<ChatBubbleOutlineRoundedIcon sx={{ fontSize: 16 }} />}
            sx={{
              backgroundColor: PURPLE_PRIMARY,
              color: "#FFFFFF",
              fontSize: "0.75rem",
              fontWeight: 600,
              borderRadius: "8px",
              py: 0.6,
              px: 1.75,
              "&:hover": { backgroundColor: "#6D28D9" },
            }}
          >
            Open Chat
          </Button>

          {!isGroup && (
            <Button
              variant="outlined"
              size="small"
              color={contact.is_blocked || contact.isBlocked ? "success" : "error"}
              onClick={() => setConfirmBlockOpen(true)}
              startIcon={contact.is_blocked || contact.isBlocked ? <LockOpenOutlinedIcon sx={{ fontSize: 16 }} /> : <BlockOutlinedIcon sx={{ fontSize: 16 }} />}
              sx={{
                fontSize: "0.75rem",
                fontWeight: 600,
                borderRadius: "8px",
                py: 0.6,
                px: 1.5,
              }}
            >
              {contact.is_blocked || contact.isBlocked ? "Unblock" : "Block User"}
            </Button>
          )}

          {isGroup && (
            <Button
              variant="outlined"
              size="small"
              color="error"
              onClick={() => setConfirmLeaveOpen(true)}
              startIcon={<ExitToAppRoundedIcon sx={{ fontSize: 16 }} />}
              sx={{
                fontSize: "0.75rem",
                fontWeight: 600,
                borderRadius: "8px",
                py: 0.6,
                px: 1.5,
              }}
            >
              Leave Group
            </Button>
          )}
        </Stack>

        <Divider sx={{ mb: 2 }} />

        {/* ── GROUP SPECIFIC SECTION ── */}
        {isGroup ? (
          <Box>
            {/* About / Description */}
            <Box sx={{ mb: 2.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: theme.palette.text.secondary }}>
                  GROUP DESCRIPTION
                </Typography>
                {isAdmin && !isEditingDesc && (
                  <IconButton size="small" onClick={() => setIsEditingDesc(true)} sx={{ color: theme.palette.text.secondary }}>
                    <EditOutlinedIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                )}
              </Box>

              {isEditingDesc ? (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <TextField
                    multiline
                    rows={2}
                    size="small"
                    fullWidth
                    value={groupDescInput}
                    onChange={(e) => setGroupDescInput(e.target.value)}
                    placeholder="Enter group description"
                  />
                  <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                    <Button size="small" onClick={() => setIsEditingDesc(false)}>
                      Cancel
                    </Button>
                    <Button size="small" variant="contained" onClick={handleSaveGroupDesc} disabled={isSavingInfo}>
                      Save
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Typography variant="body2" sx={{ color: theme.palette.text.primary, fontSize: "0.825rem" }}>
                  {groupDetails?.description || contact.description || "No description provided."}
                </Typography>
              )}
            </Box>

            {/* Members Section Header */}
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: theme.palette.text.secondary }}>
                MEMBERS ({membersList.length})
              </Typography>

              {isAdmin && (
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => setIsAddMemberOpen(true)}
                  startIcon={<PersonAddAlt1RoundedIcon sx={{ fontSize: 15 }} />}
                  sx={{
                    fontSize: "0.72rem",
                    py: 0.35,
                    px: 1,
                    borderRadius: "6px",
                    borderColor: PURPLE_PRIMARY,
                    color: PURPLE_PRIMARY,
                  }}
                >
                  Add Member
                </Button>
              )}
            </Box>

            {/* Members List */}
            {isLoadingGroup ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                <CircularProgress size={20} />
              </Box>
            ) : (
              <Stack spacing={1} sx={{ mb: 3 }}>
                {membersList.map((member) => {
                  const isMemberAdmin = member.role === "admin";
                  const isSelf = String(member.id) === myId;

                  return (
                    <Box
                      key={member.id}
                      sx={{
                        p: 1,
                        borderRadius: "8px",
                        border: `1px solid ${theme.palette.divider}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        backgroundColor: theme.palette.mode === "dark" ? alpha("#FFFFFF", 0.02) : "#FFFFFF",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, minWidth: 0 }}>
                        <Avatar
                          src={member.img || member.avatar}
                          alt={member.name}
                          sx={{
                            width: 34,
                            height: 34,
                            fontSize: "0.8rem",
                            fontWeight: 700,
                            backgroundColor: alpha(PURPLE_PRIMARY, 0.12),
                            color: PURPLE_PRIMARY,
                          }}
                        >
                          {member.name?.[0]?.toUpperCase()}
                        </Avatar>

                        <Box sx={{ minWidth: 0 }}>
                          <Typography noWrap variant="subtitle2" sx={{ fontWeight: 600, fontSize: "0.8125rem" }}>
                            {member.name} {isSelf && "(You)"}
                          </Typography>
                          <Typography noWrap variant="caption" sx={{ color: theme.palette.text.secondary, fontSize: "0.7rem" }}>
                            {member.email}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Chip
                          size="small"
                          label={isMemberAdmin ? "Admin" : "Member"}
                          sx={{
                            height: 20,
                            fontSize: "0.68rem",
                            fontWeight: 700,
                            backgroundColor: isMemberAdmin ? alpha(PURPLE_PRIMARY, 0.12) : alpha(theme.palette.action.hover, 0.08),
                            color: isMemberAdmin ? PURPLE_PRIMARY : theme.palette.text.secondary,
                          }}
                        />

                        {/* Admin Action Menu for other members */}
                        {isAdmin && !isSelf && (
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              setSelectedMember(member);
                              setMemberMenuAnchor(e.currentTarget);
                            }}
                            sx={{ color: theme.palette.text.secondary, p: 0.5 }}
                          >
                            <MoreVertRoundedIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        )}
                      </Box>
                    </Box>
                  );
                })}
              </Stack>
            )}

            {/* Group Creator Delete Option */}
            {isCreator && (
              <Button
                fullWidth
                variant="outlined"
                color="error"
                onClick={() => setConfirmDeleteOpen(true)}
                startIcon={<DeleteOutlineRoundedIcon />}
                sx={{ borderRadius: "8px", fontSize: "0.78rem", py: 0.75 }}
              >
                Delete Group
              </Button>
            )}
          </Box>
        ) : (
          /* ── 1-ON-1 CONTACT SPECIFIC SECTION ── */
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: theme.palette.text.secondary, display: "block", mb: 1 }}>
              PERSONAL INFORMATION
            </Typography>

            <Box sx={{ mb: 2.5 }}>
              {personalInfo.map((row, idx) => {
                const Icon = row.icon;
                return (
                  <React.Fragment key={row.label}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", py: 0.85 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Icon sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
                        <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontSize: "0.78rem" }}>
                          {row.label}
                        </Typography>
                      </Box>
                      <Typography variant="caption" sx={{ fontWeight: 600, fontSize: "0.78rem", color: theme.palette.text.primary }}>
                        {row.value}
                      </Typography>
                    </Box>
                    {idx < personalInfo.length - 1 && <Divider sx={{ my: 0.25, borderColor: alpha(theme.palette.divider, 0.6) }} />}
                  </React.Fragment>
                );
              })}
            </Box>

            <Typography variant="caption" sx={{ fontWeight: 700, color: theme.palette.text.secondary, display: "block", mb: 1 }}>
              SHARED CONTENT
            </Typography>

            <Stack direction="row" spacing={1.5}>
              <Box
                sx={{
                  flex: 1,
                  p: 1.25,
                  borderRadius: "10px",
                  border: `1px solid ${theme.palette.divider}`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 0.25,
                }}
              >
                <ImageOutlinedIcon sx={{ fontSize: 18, color: theme.palette.text.secondary }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  {isLoadingStats ? "—" : sharedStats.media}
                </Typography>
                <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontSize: "0.7rem" }}>
                  Media
                </Typography>
              </Box>

              <Box
                sx={{
                  flex: 1,
                  p: 1.25,
                  borderRadius: "10px",
                  border: `1px solid ${theme.palette.divider}`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 0.25,
                }}
              >
                <InsertDriveFileOutlinedIcon sx={{ fontSize: 18, color: theme.palette.text.secondary }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  {isLoadingStats ? "—" : sharedStats.files}
                </Typography>
                <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontSize: "0.7rem" }}>
                  Files
                </Typography>
              </Box>

              <Box
                sx={{
                  flex: 1,
                  p: 1.25,
                  borderRadius: "10px",
                  border: `1px solid ${theme.palette.divider}`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 0.25,
                }}
              >
                <LinkRoundedIcon sx={{ fontSize: 18, color: theme.palette.text.secondary }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  {isLoadingStats ? "—" : sharedStats.links}
                </Typography>
                <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontSize: "0.7rem" }}>
                  Links
                </Typography>
              </Box>
            </Stack>
          </Box>
        )}
      </DialogContent>

      {/* ── Admin Menu on Group Member ── */}
      <Menu
        anchorEl={memberMenuAnchor}
        open={Boolean(memberMenuAnchor)}
        onClose={() => {
          setMemberMenuAnchor(null);
          setSelectedMember(null);
        }}
        slotProps={{ paper: { sx: { minWidth: 180, borderRadius: "10px" } } }}
      >
        {selectedMember?.role !== "admin" ? (
          <MenuItem onClick={() => handleSetRole("admin")}>
            <ListItemIcon>
              <AdminPanelSettingsRoundedIcon fontSize="small" sx={{ color: PURPLE_PRIMARY }} />
            </ListItemIcon>
            <ListItemText primary="Make Group Admin" />
          </MenuItem>
        ) : (
          <MenuItem onClick={() => handleSetRole("member")}>
            <ListItemIcon>
              <AdminPanelSettingsRoundedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Dismiss as Admin" />
          </MenuItem>
        )}

        <Divider />

        <MenuItem onClick={handleRemoveMember} sx={{ color: "error.main" }}>
          <ListItemIcon>
            <PersonRemoveRoundedIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText primary="Remove from Group" />
        </MenuItem>
      </Menu>

      {/* ── Add Member Subdialog ── */}
      <Dialog
        open={isAddMemberOpen}
        onClose={() => setIsAddMemberOpen(false)}
        maxWidth="xs"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: "12px", p: 1 } } }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: "1rem" }}>
          Add Member to Group
        </DialogTitle>
        <DialogContent>
          <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: "block", mb: 1.5 }}>
            Select a contact to add to {groupDetails?.name || contact.name}
          </Typography>

          {availableToAdd.length === 0 ? (
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, textAlign: "center", py: 2 }}>
              All contacts are already in this group.
            </Typography>
          ) : (
            <Stack spacing={1} sx={{ maxHeight: 240, overflowY: "auto" }}>
              {availableToAdd.map((u: TUser) => {
                const isSelected = selectedUserToAdd === String(u.id);
                return (
                  <Box
                    key={u.id}
                    onClick={() => setSelectedUserToAdd(String(u.id))}
                    sx={{
                      p: 1,
                      borderRadius: "8px",
                      border: `1.5px solid ${isSelected ? PURPLE_PRIMARY : theme.palette.divider}`,
                      backgroundColor: isSelected ? alpha(PURPLE_PRIMARY, 0.05) : "transparent",
                      display: "flex",
                      alignItems: "center",
                      gap: 1.25,
                      cursor: "pointer",
                    }}
                  >
                    <Avatar src={u.avatar || u.img} sx={{ width: 32, height: 32, fontSize: "0.8rem" }}>
                      {u.name?.[0]?.toUpperCase()}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: "0.8125rem" }}>
                        {u.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontSize: "0.7rem" }}>
                        {u.email}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 1.5 }}>
          <Button size="small" onClick={() => setIsAddMemberOpen(false)}>
            Cancel
          </Button>
          <Button
            size="small"
            variant="contained"
            disabled={!selectedUserToAdd || isAddingMember}
            onClick={handleAddMember}
            sx={{ backgroundColor: PURPLE_PRIMARY, "&:hover": { backgroundColor: "#6D28D9" } }}
          >
            {isAddingMember ? <CircularProgress size={16} color="inherit" /> : "Add to Group"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Confirmation Modals ── */}
      {/* Leave Group */}
      <Dialog open={confirmLeaveOpen} onClose={() => setConfirmLeaveOpen(false)} maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 700, fontSize: "1rem" }}>Leave Group?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to leave <strong>{groupDetails?.name || contact.name}</strong>? You will no longer receive messages.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button size="small" onClick={() => setConfirmLeaveOpen(false)}>Cancel</Button>
          <Button size="small" variant="contained" color="error" onClick={handleLeaveGroup}>Leave Group</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Group */}
      <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)} maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 700, fontSize: "1rem" }}>Delete Group?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to permanently delete <strong>{groupDetails?.name || contact.name}</strong>? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button size="small" onClick={() => setConfirmDeleteOpen(false)}>Cancel</Button>
          <Button size="small" variant="contained" color="error" onClick={handleDeleteGroup}>Delete Permanently</Button>
        </DialogActions>
      </Dialog>

      {/* Block/Unblock User */}
      <Dialog open={confirmBlockOpen} onClose={() => setConfirmBlockOpen(false)} maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 700, fontSize: "1rem" }}>
          {contact.is_blocked || contact.isBlocked ? "Unblock Contact?" : "Block Contact?"}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            {contact.is_blocked || contact.isBlocked
              ? `Do you want to unblock ${contact.name}? They will be able to message you again.`
              : `Are you sure you want to block ${contact.name}? Blocked contacts cannot send you messages.`}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button size="small" onClick={() => setConfirmBlockOpen(false)}>Cancel</Button>
          <Button
            size="small"
            variant="contained"
            color={contact.is_blocked || contact.isBlocked ? "success" : "error"}
            onClick={handleToggleBlock}
          >
            {contact.is_blocked || contact.isBlocked ? "Unblock" : "Block"}
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default ContactDetailModal;
