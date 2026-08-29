/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { RootState } from "../../redux/store";
import { rightSideActionInfo, rightSiteIds } from "../../constants/common";
import { rightSideActionTypes, TUser } from "../../types";
import {
  SET_CONVERSATION,
  SET_RECEIVER_ID,
  SET_RIGHT_SIDEBAR_OPEN_STATUS,
} from "../../redux/features/chat/conversationSlice";
import {
  addGroupMemberAPI,
  removeGroupMemberAPI,
  setGroupMemberRoleAPI,
  updateGroupAPI,
  leaveGroupAPI,
  clearChatAPI,
} from "../../services/message";
import { blockUserAPI, getAllRegisteredUsersAPI } from "../../services/auth";
import { SET_ALL_USERS } from "../../redux/features/auth/authSlice";
import { showToast } from "../../utils/toast";
import { COMMON_ERROR_MESSAGE, FAILED, SUCCESS } from "../../constants/common";

export const RightSidebar = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [memberPickerOpen, setMemberPickerOpen] = useState(false);
  const [addingMember, setAddingMember] = useState(false);
  const [removeMemberOpen, setRemoveMemberOpen] = useState(false);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [renameOpen, setRenameOpen] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const [allRegisteredUsers, setAllRegisteredUsers] = useState<TUser[]>([]);

  const { receiverId } = useSelector((state: RootState) => state?.message);
  const { allUsers, loginUser } = useSelector((state: RootState) => state?.auth);

  // Load every registered user so ANY user (friend or not) can be added to a group.
  useEffect(() => {
    getAllRegisteredUsersAPI({})
      .then((res) => {
        if (res?.success) setAllRegisteredUsers(res?.data || []);
      })
      .catch((error) => console.error("Failed to load registered users:", error));
  }, []);

  const selectedUserInfo = useMemo(() => {
    if (allUsers?.length > 0 && receiverId) {
      return allUsers.find((u: TUser) => u?.id === receiverId);
    }
    return null;
  }, [receiverId, allUsers]);

  const groupMembers = useMemo(() => {
    if (!selectedUserInfo?.isGroup) return [];
    return Array.isArray(selectedUserInfo.members) ? selectedUserInfo.members : [];
  }, [selectedUserInfo]);

  const suggestedMembers = useMemo(() => {
    if (!selectedUserInfo?.isGroup) return [];
    const existingIds = new Set(groupMembers.map((member: any) => String(member.id || member.user_id)));
    const source = allRegisteredUsers.length > 0 ? allRegisteredUsers : allUsers || [];
    return source.filter((user: TUser) => {
      const userId = String(user.id);
      return !user.isGroup && userId !== String(loginUser?.id) && !existingIds.has(userId);
    });
  }, [allUsers, allRegisteredUsers, groupMembers, loginUser, selectedUserInfo]);

  const myRole = useMemo(() => {
    if (!selectedUserInfo?.isGroup) return "";
    const currentMember = groupMembers.find(
      (member: any) => String(member.id || member.user_id) === String(loginUser?.id),
    );
    return currentMember?.role || "member";
  }, [groupMembers, loginUser, selectedUserInfo]);

  const isAdmin = myRole === "admin";
  const userImage = selectedUserInfo?.profileImage
    ? `data:image/jpeg;base64,${selectedUserInfo?.profileImage}`
    : "";

  const handleClick = async (info: rightSideActionTypes, userInfo?: TUser) => {
    if (!userInfo) return;

    switch (info.id) {
      case rightSiteIds.FAVORITE:
        console.log("favorite clicked", userInfo);
        break;
      case rightSiteIds.CLEAR_CHAT: {
        const res = await clearChatAPI({ friendId: userInfo.id });
        if (res?.success) {
          dispatch(SET_CONVERSATION({}));
          showToast(SUCCESS, "Chat cleared");
        } else {
          showToast(FAILED, res?.message || COMMON_ERROR_MESSAGE);
        }
        break;
      }
      case rightSiteIds.BLOCK_USER: {
        const res = await blockUserAPI({ friendId: userInfo?.id });
        if (res?.success) {
          dispatch(SET_CONVERSATION({}));
          dispatch(SET_ALL_USERS(allUsers.filter((user: TUser) => user.id !== userInfo.id)));
          dispatch(SET_RECEIVER_ID(""));
          dispatch(SET_RIGHT_SIDEBAR_OPEN_STATUS(false));
          showToast(SUCCESS, "User blocked");
        } else {
          showToast(FAILED, res?.message || COMMON_ERROR_MESSAGE);
        }
        break;
      }
      case rightSiteIds.DELETE_CHAT:
        console.log("delete chat clicked", userInfo);
        break;
      default:
        break;
    }
  };

  const handleAddMember = async (memberId: string) => {
    if (!selectedUserInfo?.isGroup || !memberId) return;

    setAddingMember(true);
    try {
      const response = await addGroupMemberAPI(String(selectedUserInfo.id), {
        userIdToAdd: Number(memberId),
      });

      if (response?.success) {
        const memberUser = (allUsers || []).find(
          (user: TUser) => String(user.id) === String(memberId),
        ) || (allRegisteredUsers || []).find(
          (user: TUser) => String(user.id) === String(memberId),
        );
        const nextGroupMembers = [
          ...(groupMembers || []),
          {
            id: memberId,
            name: memberUser?.name || "Member",
            email: memberUser?.email || "",
            role: "member",
          },
        ];

        dispatch(
          SET_ALL_USERS(
            (allUsers || []).map((user: TUser) =>
              String(user.id) === String(selectedUserInfo.id)
                ? { ...user, members: nextGroupMembers }
                : user,
            ),
          ),
        );
        showToast(SUCCESS, `${memberUser?.name || "User"} added to the group`);
        setMemberPickerOpen(false);
      } else {
        showToast(FAILED, response?.message || "Unable to add member to group");
      }
    } catch (error) {
      console.error("Failed to add group member:", error);
      showToast(FAILED, "Unable to add member to group");
    } finally {
      setAddingMember(false);
    }
  };

  const updateSelectedGroup = (group: any) => {
    const groupId = String(group?.id ?? group?.group_id ?? selectedUserInfo?.id);
    const nextGroup = {
      ...group,
      id: groupId,
      isGroup: true,
      img: selectedUserInfo?.img || "",
      description: group?.description || selectedUserInfo?.description || "",
      members: group?.members || groupMembers,
    };
    dispatch(
      SET_ALL_USERS(
        (allUsers || []).map((user: TUser) =>
          String(user.id) === groupId ? { ...user, ...nextGroup } : user,
        ),
      ),
    );
  };

  const handleRemoveMember = async (memberId: string | number) => {
    if (!selectedUserInfo?.id) return;
    setProcessing(true);
    try {
      const res = await removeGroupMemberAPI(selectedUserInfo.id, memberId);
      if (res?.success && res.data) {
        updateSelectedGroup(res.data);
        showToast(SUCCESS, "Member removed from the group");
        setRemoveMemberOpen(false);
      } else {
        showToast(FAILED, res?.message || "Unable to remove member");
      }
    } catch (error) {
      console.error("Failed to remove group member:", error);
      showToast(FAILED, COMMON_ERROR_MESSAGE);
    } finally {
      setProcessing(false);
    }
  };

  const handleRoleChange = async (memberId: string | number, role: "admin" | "member") => {
    if (!selectedUserInfo?.id) return;
    setProcessing(true);
    try {
      const res = await setGroupMemberRoleAPI(selectedUserInfo.id, memberId, role);
      if (res?.success && res.data) {
        updateSelectedGroup(res.data);
        showToast(SUCCESS, role === "admin" ? "Member promoted to admin" : "Admin demoted to member");
      } else {
        showToast(FAILED, res?.message || "Unable to update role");
      }
    } catch (error) {
      console.error("Failed to update member role:", error);
      showToast(FAILED, COMMON_ERROR_MESSAGE);
    } finally {
      setProcessing(false);
    }
  };

  const openRenameDialog = () => {
    setNewGroupName(selectedUserInfo?.name || "");
    setNewGroupDescription(selectedUserInfo?.description || "");
    setRenameOpen(true);
  };

  const handleRenameGroup = async () => {
    if (!selectedUserInfo?.id || !newGroupName.trim()) return;
    setProcessing(true);
    try {
      const res = await updateGroupAPI(selectedUserInfo.id, {
        name: newGroupName.trim(),
        description: newGroupDescription.trim(),
      });
      if (res?.success && res.data) {
        updateSelectedGroup(res.data);
        showToast(SUCCESS, "Group updated");
        setRenameOpen(false);
      } else {
        showToast(FAILED, res?.message || "Unable to update group");
      }
    } catch (error) {
      console.error("Failed to update group:", error);
      showToast(FAILED, COMMON_ERROR_MESSAGE);
    } finally {
      setProcessing(false);
    }
  };

  const handleLeaveGroup = async () => {
    if (!selectedUserInfo?.id) return;
    setProcessing(true);
    try {
      const res = await leaveGroupAPI(selectedUserInfo.id);
      if (res?.success) {
        dispatch(
          SET_ALL_USERS(
            (allUsers || []).filter((u: TUser) => String(u.id) !== String(selectedUserInfo.id)),
          ),
        );
        dispatch(SET_RECEIVER_ID(""));
        dispatch(SET_CONVERSATION({}));
        dispatch(SET_RIGHT_SIDEBAR_OPEN_STATUS(false));
        showToast(SUCCESS, "You left the group");
      } else {
        showToast(FAILED, res?.message || "Unable to leave the group");
      }
    } catch (error) {
      console.error("Failed to leave group:", error);
      showToast(FAILED, COMMON_ERROR_MESSAGE);
    } finally {
      setProcessing(false);
      setLeaveOpen(false);
    }
  };

  const renderGroupPanel = () => {
    if (!selectedUserInfo?.isGroup) return null;

    const actionButtons = [
      {
        label: "Add member",
        disabled: !isAdmin || suggestedMembers.length === 0 || processing,
        onClick: () => setMemberPickerOpen(true),
        icon: <PersonAddAltOutlinedIcon />,
      },
      {
        label: "Remove member",
        disabled: !isAdmin,
        onClick: () => setRemoveMemberOpen(true),
        icon: <DeleteIcon />,
      },
      {
        label: "Manage admins",
        disabled: !isAdmin,
        onClick: () => setRoleDialogOpen(true),
        icon: <AdminPanelSettingsOutlinedIcon />,
      },
      {
        label: "Rename group",
        disabled: !isAdmin,
        onClick: openRenameDialog,
        icon: <EditOutlinedIcon />,
      },
      {
        label: "Leave group",
        disabled: false,
        onClick: () => setLeaveOpen(true),
        icon: <LogoutOutlinedIcon />,
      },
    ];

    return (
      <Box sx={{ color: theme.palette.text.primary }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1, mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Group details
          </Typography>
          <IconButton
            size="small"
            onClick={() => dispatch(SET_RIGHT_SIDEBAR_OPEN_STATUS(false))}
            sx={{ color: theme.palette.text.secondary }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <Avatar
            sx={{
              width: 82,
              height: 82,
              fontSize: "1.7rem",
              fontWeight: 700,
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              boxShadow: `0 4px 14px ${alpha(theme.palette.common.black, 0.12)}`,
            }}
          >
            {selectedUserInfo?.name?.slice(0, 2).toUpperCase() || "GR"}
          </Avatar>
        </Box>

        <Typography variant="h6" sx={{ textAlign: "center", fontWeight: 700, mb: 0.5 }}>
          {selectedUserInfo?.name || "Group"}
        </Typography>
        <Typography variant="body2" sx={{ color: theme.palette.text.secondary, textAlign: "center", mb: 2 }}>
          {selectedUserInfo?.description || "Group conversation"}
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mb: 3, flexWrap: "wrap" }}>
          <Chip label={`${groupMembers.length} members`} size="small" color="primary" />
          <Chip label={isAdmin ? "Admin" : "Member"} size="small" variant="outlined" />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography
            variant="caption"
            sx={{ color: theme.palette.text.secondary, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}
          >
            Members
          </Typography>
          <List dense sx={{ mt: 1 }}>
            {groupMembers.map((member: any) => (
              <ListItem key={String(member.id || member.user_id)} disableGutters sx={{ borderRadius: 2, px: 1, py: 0.6 }}>
                <ListItemAvatar sx={{ minWidth: 42 }}>
                  <Avatar sx={{ width: 32, height: 32, fontSize: "0.9rem" }}>
                    {(member.name || member.email || "U").slice(0, 1).toUpperCase()}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                        {member.name || member.email || "Unknown user"}
                      </Typography>
                      {member.role === "admin" && <Chip label="Admin" size="small" color="success" />}
                    </Box>
                  }
                  secondary={member.email || "Member"}
                />
              </ListItem>
            ))}
          </List>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {actionButtons.map((action) => (
            <Button
              key={action.label}
              variant={action.label === "Add member" ? "contained" : "outlined"}
              startIcon={
                processing && action.label !== "Leave group" ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  action.icon
                )
              }
              onClick={action.onClick}
              disabled={action.disabled}
              sx={{ justifyContent: "flex-start", borderRadius: 2, py: 1, textTransform: "none" }}
            >
              {action.label}
            </Button>
          ))}
        </Box>

        <Dialog open={memberPickerOpen} onClose={() => setMemberPickerOpen(false)} fullWidth maxWidth="xs">
          <DialogTitle>Add a member</DialogTitle>
          <DialogContent sx={{ pt: 1 }}>
            <List dense>
              {suggestedMembers.map((user: TUser) => (
                <ListItem
                  key={String(user.id)}
                  onClick={() => handleAddMember(String(user.id))}
                  sx={{ borderRadius: 2, mb: 0.5, cursor: "pointer" }}
                >
                  <ListItemAvatar>
                    <Avatar>{user.name?.[0] || user.email?.[0] || "U"}</Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={user.name} secondary={user.email} />
                </ListItem>
              ))}
            </List>
            {suggestedMembers.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                No additional members are available to add.
              </Typography>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setMemberPickerOpen(false)} disabled={addingMember}>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={removeMemberOpen} onClose={() => setRemoveMemberOpen(false)} fullWidth maxWidth="xs">
          <DialogTitle>Remove a member</DialogTitle>
          <DialogContent sx={{ pt: 1 }}>
            <List dense>
              {groupMembers
                .filter((member: any) => String(member.id || member.user_id) !== String(loginUser?.id))
                .map((member: any) => (
                  <ListItem
                    key={String(member.id || member.user_id)}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        color="error"
                        disabled={processing}
                        onClick={() => handleRemoveMember(member.id || member.user_id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    }
                    sx={{ borderRadius: 2, mb: 0.5 }}
                  >
                    <ListItemAvatar>
                      <Avatar>{(member.name || "U").slice(0, 1).toUpperCase()}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${member.name || "Unknown user"}${member.role === "admin" ? " (Admin)" : ""}`}
                      secondary={member.email}
                    />
                  </ListItem>
                ))}
            </List>
            {groupMembers.filter((member: any) => String(member.id || member.user_id) !== String(loginUser?.id)).length === 0 && (
              <Typography variant="body2" color="text.secondary">
                There are no other members to remove.
              </Typography>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setRemoveMemberOpen(false)} disabled={processing}>Cancel</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={roleDialogOpen} onClose={() => setRoleDialogOpen(false)} fullWidth maxWidth="xs">
          <DialogTitle>Manage admins</DialogTitle>
          <DialogContent sx={{ pt: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: "block" }}>
              Make a member an admin or remove admin rights (the group must keep at least one admin).
            </Typography>
            <List dense>
              {groupMembers.map((member: any) => {
                const isSelf = String(member.id || member.user_id) === String(loginUser?.id);
                return (
                  <ListItem
                    key={String(member.id || member.user_id)}
                    secondaryAction={
                      <Button
                        size="small"
                        color={member.role === "admin" ? "error" : "primary"}
                        disabled={processing || (isSelf && member.role === "admin")}
                        onClick={() =>
                          handleRoleChange(member.id || member.user_id, member.role === "admin" ? "member" : "admin")
                        }
                      >
                        {member.role === "admin" ? "Remove admin" : "Make admin"}
                      </Button>
                    }
                    sx={{ borderRadius: 2, mb: 0.5 }}
                  >
                    <ListItemAvatar>
                      <Avatar>{(member.name || "U").slice(0, 1).toUpperCase()}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={member.name || "Unknown user"}
                      secondary={member.role === "admin" ? "Admin" : "Member"}
                    />
                  </ListItem>
                );
              })}
            </List>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setRoleDialogOpen(false)} disabled={processing}>Close</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={renameOpen} onClose={() => setRenameOpen(false)} fullWidth maxWidth="xs">
          <DialogTitle>Edit group</DialogTitle>
          <DialogContent sx={{ pt: 1, display: "flex", flexDirection: "column", gap: 1.5 }}>
            <TextField
              autoFocus
              fullWidth
              label="Group name"
              value={newGroupName}
              onChange={(event) => setNewGroupName(event.target.value)}
            />
            <TextField
              fullWidth
              multiline
              minRows={2}
              label="Description (optional)"
              value={newGroupDescription}
              onChange={(event) => setNewGroupDescription(event.target.value)}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setRenameOpen(false)} disabled={processing}>Cancel</Button>
            <Button variant="contained" onClick={handleRenameGroup} disabled={processing || !newGroupName.trim()}>
              {processing ? <CircularProgress size={16} color="inherit" /> : "Save"}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={leaveOpen} onClose={() => setLeaveOpen(false)} fullWidth maxWidth="xs">
          <DialogTitle>Leave group</DialogTitle>
          <DialogContent sx={{ pt: 1 }}>
            <Typography variant="body2">
              Are you sure you want to leave{" "}
              <strong>{selectedUserInfo?.name || "this group"}</strong>? You will no longer receive messages from it.
              {isAdmin && " Since you are an admin, another member will be made admin."}
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setLeaveOpen(false)} disabled={processing}>Cancel</Button>
            <Button color="error" variant="contained" onClick={handleLeaveGroup} disabled={processing}>
              {processing ? <CircularProgress size={16} color="inherit" /> : "Leave"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  };

  if (selectedUserInfo?.isGroup) {
    return renderGroupPanel();
  }

  return (
    <Box sx={{ color: theme.palette.text.primary }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1, mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Contact Info
        </Typography>
        <IconButton
          size="small"
          onClick={() => dispatch(SET_RIGHT_SIDEBAR_OPEN_STATUS(false))}
          sx={{ color: theme.palette.text.secondary }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        <Avatar
          src={selectedUserInfo?.img || userImage}
          sx={{
            width: 80,
            height: 80,
            fontSize: "1.75rem",
            fontWeight: 600,
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            boxShadow: `0 4px 14px ${alpha(theme.palette.common.black, 0.12)}`,
          }}
        >
          {!selectedUserInfo?.img && !userImage && selectedUserInfo?.name?.slice(0, 2).toUpperCase()}
        </Avatar>
      </Box>

      <Typography variant="h6" sx={{ textAlign: "center", fontWeight: 700, mb: 0.5 }}>
        {selectedUserInfo?.name || "User"}
      </Typography>
      <Typography variant="body2" sx={{ color: theme.palette.text.secondary, textAlign: "center", mb: 3 }}>
        {selectedUserInfo?.email || ""}
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography
          variant="caption"
          sx={{
            color: theme.palette.text.secondary,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          About
        </Typography>
        <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 500 }}>
          {selectedUserInfo?.bio || "No bio available."}
        </Typography>
      </Box>

      <Divider sx={{ my: 2, borderColor: theme.palette.divider }} />

      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        {(selectedUserInfo?.isGroup ? [] : rightSideActionInfo).map((action) => (
          <Box
            key={action.id}
            onClick={() => handleClick(action, selectedUserInfo)}
            sx={{
              cursor: "pointer",
              color: action.isRed ? theme.palette.error.main : theme.palette.text.primary,
              px: 2,
              py: 1.25,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              transition: "background-color 0.2s ease",
              "&:hover": {
                backgroundColor: action.isRed
                  ? alpha(theme.palette.error.main, 0.08)
                  : alpha(theme.palette.action.hover, 0.08),
              },
            }}
          >
            <action.icon sx={{ fontSize: "1.3rem" }} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {action.title}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
