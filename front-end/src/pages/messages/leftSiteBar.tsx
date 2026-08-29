/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import GroupAddRoundedIcon from "@mui/icons-material/GroupAddRounded";
import MarkEmailUnreadRoundedIcon from "@mui/icons-material/MarkEmailUnreadRounded";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import { SET_RECEIVER_ID, SET_RIGHT_SIDEBAR_OPEN_STATUS } from "../../redux/features/chat/conversationSlice";
import { SET_ALL_USERS } from "../../redux/features/auth/authSlice";
import { RootState } from "../../redux/store";
import type { TUser } from "../../types";
import { toStartCaseStr } from "../../utils/common";
import { getGroupsAPI, getPendingGroupInvitationsAPI, acceptGroupInvitationAPI } from "../../services/message";
import { getAllRegisteredUsersAPI } from "../../services/auth";
import CreateGroupDialog from "./createGroupDialog";
import ProfileMenu from "../../components/ProfileMenu/ProfileMenu";
import SearchInput from "../../components/ui/SearchInput";
import UserAvatar from "../../components/ui/UserAvatar";
import ChatSkeleton from "../../components/ui/ChatSkeleton";
import type { Conversation } from "../../components/ui/ChatSkeleton";

interface Props {
  onSelectChat?: () => void;
  activeConversation?: string;
}

const SEARCH_USERS_DELAY = 600;

function LeftSiteBar({ onSelectChat, activeConversation }: Props) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loginUser, allUsers = [] } = useSelector((state: RootState) => state?.auth);

  const [searchValue, setSearchValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [profileAnchor, setProfileAnchor] = useState<null | HTMLElement>(null);
  const [groupDialogOpen, setGroupDialogOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [registeredUsers, setRegisteredUsers] = useState<TUser[]>([]);
  const [pendingGroupInvites, setPendingGroupInvites] = useState<any[]>([]);
  const [groupInvitesOpen, setGroupInvitesOpen] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => setSearchTerm(searchValue), SEARCH_USERS_DELAY);
    return () => clearTimeout(handler);
  }, [searchValue]);

  const friendUsers = (allUsers || []).filter(
    (user: TUser) => String(user.id) !== String(loginUser?.id) && !user.isGroup,
  );

  // Load every registered user (friends AND non-friends) so the group
  // creation popup can invite users who are not friends yet.
  const loadRegisteredUsers = async (): Promise<void> => {
    try {
      const res = await getAllRegisteredUsersAPI({});
      setRegisteredUsers(res?.success ? res.data || [] : []);
    } catch (error) {
      console.error("Failed to load registered users:", error);
      setRegisteredUsers([]);
    }
  };

  const handleOpenCreateGroup = async () => {
    setMenuAnchor(null);
    await loadRegisteredUsers();
    setGroupDialogOpen(true);
  };

  const openGroupInvites = async () => {
    setMenuAnchor(null);
    const response = await getPendingGroupInvitationsAPI();
    setPendingGroupInvites(response?.success ? response.data || [] : []);
    setGroupInvitesOpen(true);
  };

  const acceptGroupInvite = async (invitationId: string | number) => {
    const response = await acceptGroupInvitationAPI(invitationId);
    if (!response?.success) return;
    setPendingGroupInvites((items) => items.filter((item) => String(item.id) !== String(invitationId)));
    const groupsResponse = await getGroupsAPI();
    if (groupsResponse?.success) {
      const groups = (groupsResponse.data || []).map((group: TUser) => ({
        ...group,
        id: String(group.id),
        isGroup: true,
        img: "",
      }));
      dispatch(SET_ALL_USERS([...allUsers.filter((user: TUser) => !user.isGroup), ...groups]));
    }
  };

  const handleGroupCreated = async (createdGroup?: TUser) => {
    setGroupDialogOpen(false);
    setMenuAnchor(null);

    if (!createdGroup) {
      const response = await getGroupsAPI();
      if (response?.success) {
        const groups = (response.data || []).map((group: TUser) => ({
          ...group,
          id: String(group.id),
          isGroup: true,
          img: "",
        }));
        dispatch(
          SET_ALL_USERS([
            ...allUsers.filter((user: TUser) => !user.isGroup),
            ...groups,
          ]),
        );
      }
      return;
    }

    const nextGroup = {
      ...createdGroup,
      id: String(createdGroup.id),
      isGroup: true,
      img: "",
      members: createdGroup.members || [],
    };
    dispatch(
      SET_ALL_USERS([
        ...allUsers.filter((user: TUser) => !user.isGroup),
        nextGroup,
      ]),
    );
  };

  const conversations: Conversation[] = useMemo(() => {
    const list = Array.isArray(allUsers) ? allUsers : [];
    const mapped = list
      .filter((u: TUser) => String(u.id) !== String(loginUser?.id))
      .map((u: TUser, index: number) => {
        const last = u.lastMessage as any;
        const created = last?.created_at ? new Date(last.created_at) : null;
        const time = created
          ? created.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          : "";
        return {
          id: String(u.id),
          name: toStartCaseStr(u.name || ""),
          avatar: u?.img || "",
          isGroup: !!u.isGroup,
          online: !u.isGroup && !!u.online,
          lastMessage: last?.content || "",
          time,
          unread: 0,
          muted: false,
          isActive: String(u.id) === activeConversation,
          key: `conv-${u.id}-${index}`,
          raw: u,
          _lastDate: created ? created.getTime() : 0,
        } as Conversation & { _lastDate: number };
      });
    // most recent conversation first
    return mapped.sort((a, b) => (b._lastDate || 0) - (a._lastDate || 0));
  }, [allUsers, activeConversation, loginUser]);

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return conversations;
    return conversations.filter((c) => c.name.toLowerCase().includes(term));
  }, [conversations, searchTerm]);

  const handleSelect = (id: string) => {
    onSelectChat?.();
    navigate("/chat");
    dispatch(SET_RECEIVER_ID(id));
    dispatch(SET_RIGHT_SIDEBAR_OPEN_STATUS(false));
  };

  const handleProfileOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchor(event.currentTarget);
  };

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        backgroundColor: theme.palette.background.paper,
      }}
    >
      {/* Header: logo + avatar */}
      <Box
        sx={{
          p: 2,
          pb: 1.5,
          borderBottom: `1px solid ${theme.palette.divider}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Avatar
            variant="rounded"
            src="/logo.png"
            sx={{ width: 32, height: 32, bgcolor: "transparent" }}
          />
          <Typography variant="h6" component="span" sx={{ fontWeight: 700 }}>
            Chatty
          </Typography>
        </Box>
        <IconButton onClick={handleProfileOpen} size="small" edge="end" aria-label="profile">
          <Avatar
            src={loginUser?.img || ""}
            sx={{
              width: 38,
              height: 38,
              border: `2px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              fontSize: 15,
            }}
          >
            {loginUser?.name?.[0] || ""}
          </Avatar>
        </IconButton>
      </Box>

      {/* Search + actions */}
      <Box sx={{ px: 2, py: 1.5, borderBottom: `1px solid ${theme.palette.divider}`, display: "flex", alignItems: "center", gap: 1 }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <SearchInput
            value={searchValue}
            onChange={setSearchValue}
            placeholder="Search chats..."
            ariaLabel="Search conversations"
          />
        </Box>
        <Tooltip title="New chat, group or invitation" arrow>
          <IconButton
            onClick={(event) => setMenuAnchor(event.currentTarget)}
            aria-label="chat actions"
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              "&:hover": { backgroundColor: theme.palette.primary.dark },
              width: 42,
              height: 42,
            }}
          >
            <AddRoundedIcon />
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={() => setMenuAnchor(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          slotProps={{
            paper: {
              sx: {
                mt: 1,
                minWidth: 210,
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: "0 16px 40px rgba(0,0,0,0.35)",
              },
            },
          }}
        >
          <MenuItem onClick={handleOpenCreateGroup} sx={{ borderRadius: 1.5, mx: 0.5 }}>
            <ListItemIcon>
              <GroupAddRoundedIcon fontSize="small" />
            </ListItemIcon>
            Create group
          </MenuItem>
          <MenuItem onClick={openGroupInvites} sx={{ borderRadius: 1.5, mx: 0.5 }}>
            <ListItemIcon>
              <MarkEmailUnreadRoundedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="Group invitations"
              slotProps={{
                primary: {
                  variant: "body2",
                  ...(pendingGroupInvites.length ? { color: "primary" } : {}),
                },
              }}
            />
            {pendingGroupInvites.length > 0 && (
              <Typography variant="caption" color="primary" sx={{ fontWeight: 700 }}>
                {pendingGroupInvites.length}
              </Typography>
            )}
          </MenuItem>
          <MenuItem
            onClick={() => {
              setMenuAnchor(null);
              navigate("/inviteUser");
            }}
            sx={{ borderRadius: 1.5, mx: 0.5 }}
          >
            <ListItemIcon>
              <PersonAddAltRoundedIcon fontSize="small" />
            </ListItemIcon>
            Invite user
          </MenuItem>
        </Menu>
      </Box>

      {/* List */}
      <Box sx={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
        {!searchValue && filtered.length === 0 ? (
          <ChatSkeleton count={8} />
        ) : filtered.length === 0 ? (
          <Box
            sx={{
              p: 3,
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1.5,
              opacity: 0.6,
            }}
          >
            <SearchRoundedIcon sx={{ fontSize: 28 }} />
            <Typography variant="body2" color="text.secondary">
              {searchValue ? "No conversations found" : "No conversations yet"}
            </Typography>
          </Box>
        ) : (
          <List disablePadding>
            {filtered.map((conv) => (
              <ConversationItem
                key={conv.key}
                conv={conv}
                theme={theme}
                onClick={() => handleSelect(conv.id)}
              />
            ))}
          </List>
        )}
      </Box>

      <CreateGroupDialog
        users={registeredUsers}
        friendIds={friendUsers.map((user: TUser) => String(user.id))}
        open={groupDialogOpen}
        onClose={() => setGroupDialogOpen(false)}
        onCreated={handleGroupCreated}
      />

      <Dialog
        open={groupInvitesOpen}
        onClose={() => setGroupInvitesOpen(false)}
        fullWidth
        maxWidth="xs"
        slotProps={{ paper: { sx: { borderRadius: 3, border: `1px solid ${theme.palette.divider}` } } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Group invitations</DialogTitle>
        <DialogContent dividers>
          {pendingGroupInvites.map((invite) => (
            <Box key={invite.id} sx={{ py: 1.5, borderBottom: `1px solid ${theme.palette.divider}` }}>
              <Typography sx={{ fontWeight: 700 }}>{invite.name}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Invited by {invite.invited_by_name}
              </Typography>
              <Button size="small" variant="contained" onClick={() => acceptGroupInvite(invite.id)}>
                Accept invitation
              </Button>
            </Box>
          ))}
          {!pendingGroupInvites.length && (
            <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: "center" }}>
              You have no pending group invitations.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setGroupInvitesOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <ProfileMenu
        anchorEl={profileAnchor}
        open={Boolean(profileAnchor)}
        onClose={() => setProfileAnchor(null)}
      />
    </Box>
  );
}

function ConversationItem({ conv, theme, onClick }: any) {
  const displayName = conv.name;
  const unreadColor = theme.palette.primary.main;
  const hasUnread = conv.unread > 0;

  return (
    <ListItemButton
      onClick={onClick}
      sx={{
        alignItems: "flex-start",
        px: 2,
        py: 1.25,
        backgroundColor: conv.isActive ? "action.hover" : "inherit",
        borderLeft: conv.isActive ? `3px solid ${theme.palette.primary.main}` : "3px solid transparent",
        "&:hover": { backgroundColor: "action.hover" },
        transition: "background-color 150ms ease, border-color 150ms ease",
      }}
    >
      <ListItemAvatar sx={{ minWidth: 48, mr: 1.5 }}>
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          badgeContent={
            conv.online ? (
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  backgroundColor: theme.palette.success.main,
                  border: `2px solid ${theme.palette.background.paper}`,
                }}
              />
            ) : null
          }
        >
          <UserAvatar img={conv.avatar} name={displayName} size={48} isGroup={conv.isGroup} />
        </Badge>
      </ListItemAvatar>

      <ListItemText
        primary={displayName}
        slotProps={{
          primary: {
            sx: { fontWeight: hasUnread ? 600 : 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
          },
        }}
        secondary={
          <Typography
            component="span"
            variant="body2"
            noWrap
            sx={{
              color: theme.palette.text.secondary,
              fontWeight: hasUnread ? 600 : 400,
              display: "block",
              maxWidth: "calc(100% - 70px)",
            }}
          >
            {conv.lastMessage || "No messages yet"}
          </Typography>
        }
        sx={{ my: 0, mr: 1 }}
      />

      <ListItemSecondaryAction
        sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", minWidth: 60, pl: 1 }}
      >
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
          {conv.time || ""}
        </Typography>
        {hasUnread && (
          <Box
            sx={{
              minWidth: 20,
              height: 20,
              px: 0.6,
              mt: 0.5,
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: unreadColor,
              color: theme.palette.primary.contrastText,
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            {conv.unread}
          </Box>
        )}
      </ListItemSecondaryAction>
    </ListItemButton>
  );
}

export default LeftSiteBar;
