/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useTheme } from "@mui/material/styles";
import {
  SET_CONVERSATION,
  SET_RECEIVER_ID,
  SET_REPLIED_MESSAGE,
} from "../../redux/features/chat/conversationSlice";
import { getMessage } from "../../services/message";
import { RootState } from "../../redux/store";
import { TUser } from "../../types";
import { groupMessagesByDate } from "../../utils/timeFormat";
import logoImage from "../../assets/logo.png";
import { formattedSideBarData } from "../../utils/common";
import LeftSiteBarCard from "../../components";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import CreateGroupDialog from "./createGroupDialog";
import { acceptGroupInvitationAPI, getGroupMessagesAPI, getGroupsAPI, getPendingGroupInvitationsAPI } from "../../services/message";
import { getAllRegisteredUsersAPI } from "../../services/auth";
import { SET_ALL_USERS } from "../../redux/features/auth/authSlice";

const LeftSiteBar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loginUser, allUsers } = useSelector((state: RootState) => state?.auth);
  const { receiverId, messages } = useSelector((state: RootState) => state?.message);
  const { id: myId } = loginUser || {};
  const [search, setSearch] = useState("");
  const [groupDialogOpen, setGroupDialogOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [registeredUsers, setRegisteredUsers] = useState<TUser[]>([]);
  const [pendingGroupInvites, setPendingGroupInvites] = useState<any[]>([]);
  const [groupInvitesOpen, setGroupInvitesOpen] = useState(false);

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
      const groups = (groupsResponse.data || []).map((group: TUser) => ({ ...group, id: String(group.id), isGroup: true, img: "" }));
      dispatch(SET_ALL_USERS([...allUsers.filter((user: TUser) => !user.isGroup), ...groups]));
    }
  };

  const handleClick = async (user: Partial<TUser>) => {
    try {
      const params = user.isGroup
        ? { groupId: user.id }
        : { myId, userToChatId: user.id };
      if (user.id) {
        dispatch(SET_RECEIVER_ID(user.id));
      }
      dispatch(SET_REPLIED_MESSAGE({}));
      const res = user.isGroup
        ? await getGroupMessagesAPI(params)
        : await getMessage(params);
      if (res?.success) {
        const formattedMessage = groupMessagesByDate(res?.data);
        dispatch(SET_CONVERSATION(formattedMessage));
      }
    } catch (error) {
      console.error("Error loading chat messages:", error);
    }
  };

  useEffect(() => {
    if (Object.keys(messages).length === 0 && !!receiverId) {
      handleClick({ id: receiverId });
    }
  }, [receiverId]);

  const formattedAllUsers = useMemo(() => {
    const filtered = (allUsers || []).filter((user: TUser) =>
      `${user.name || ""} ${user.email || ""}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
    return filtered.length > 0 ? formattedSideBarData(filtered) : [];
  }, [allUsers, messages, search]);

  const friendUsers = (allUsers || []).filter(
    (user: TUser) => user.id !== myId && !user.isGroup,
  );

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
        nextGroup,
        ...allUsers.filter((user: TUser) => user.isGroup && String(user.id) !== String(nextGroup.id)),
        ...allUsers.filter((user: TUser) => !user.isGroup),
      ]),
    );
    dispatch(SET_RECEIVER_ID(String(nextGroup.id)));
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <List disablePadding>
        <ListItem disablePadding>
          <Stack
            direction="row"
            spacing={1.5}
            sx={{
              width: "100%",
              px: 2.5,
              py: 2,
              alignItems: "center",
            }}
          >
            <Avatar
              onClick={() => navigate("/")}
              alt="logo"
              src={logoImage}
              sx={{
                width: 36,
                height: 36,
                cursor: "pointer",
                transition: "transform 0.2s ease",
                "&:hover": { transform: "scale(1.05)" },
              }}
            />
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: theme.palette.text.primary }}
            >
              Chatty
            </Typography>
          </Stack>
        </ListItem>
      </List>

      <Divider sx={{ borderColor: theme.palette.divider }} />

      <Stack direction="row" spacing={1} sx={{ px: 1.5, py: 1.25 }}>
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            px: 1.25,
            borderRadius: 2,
            backgroundColor: theme.palette.action.hover,
          }}
        >
          <SearchIcon fontSize="small" color="disabled" />
          <InputBase
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search chats"
            sx={{ ml: 1, flex: 1, fontSize: 14 }}
          />
        </Box>
        <IconButton
          color="primary"
          onClick={(event) => setMenuAnchor(event.currentTarget)}
          aria-label="chat actions"
        >
          <AddIcon />
        </IconButton>
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={() => setMenuAnchor(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem onClick={handleOpenCreateGroup}>
            Create group
          </MenuItem>
          <MenuItem onClick={openGroupInvites}>
            Group invitations{pendingGroupInvites.length ? ` (${pendingGroupInvites.length})` : ""}
          </MenuItem>
          <MenuItem
            onClick={() => {
              setMenuAnchor(null);
              navigate("/inviteUser");
            }}
          >
            Invite user
          </MenuItem>
        </Menu>
      </Stack>

      <List sx={{ pt: 1, px: 1, flexGrow: 1, overflowY: "auto" }}>
        {formattedAllUsers
          ?.filter((d: TUser) => d?.id !== myId)
          ?.map((user: TUser) => (
            <ListItem key={user.id} disablePadding sx={{ mb: 0.5 }}>
              <LeftSiteBarCard user={user} onClick={handleClick} />
            </ListItem>
          ))}
        {formattedAllUsers.length === 0 && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ px: 2, py: 4, textAlign: "center" }}
          >
            No chats found. Add friends to start messaging.
          </Typography>
        )}
      </List>
      <CreateGroupDialog
        users={registeredUsers}
        friendIds={friendUsers.map((user: TUser) => String(user.id))}
        open={groupDialogOpen}
        onClose={() => setGroupDialogOpen(false)}
        onCreated={handleGroupCreated}
      />
      <Dialog open={groupInvitesOpen} onClose={() => setGroupInvitesOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Group invitations</DialogTitle>
        <DialogContent>
          {pendingGroupInvites.map((invite) => (
            <Box key={invite.id} sx={{ py: 1.25, borderBottom: `1px solid ${theme.palette.divider}` }}>
              <Typography sx={{ fontWeight: 700 }}>{invite.name}</Typography>
              <Typography variant="body2" color="text.secondary">Invited by {invite.invited_by_name}</Typography>
              <Button size="small" variant="contained" sx={{ mt: 1 }} onClick={() => acceptGroupInvite(invite.id)}>Accept invitation</Button>
            </Box>
          ))}
          {!pendingGroupInvites.length && <Typography color="text.secondary">You have no pending group invitations.</Typography>}
        </DialogContent>
        <DialogActions><Button onClick={() => setGroupInvitesOpen(false)}>Close</Button></DialogActions>
      </Dialog>
    </Box>
  );
};

export default LeftSiteBar;
