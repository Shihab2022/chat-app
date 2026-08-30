import React, { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Stack,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import LinkRoundedIcon from "@mui/icons-material/LinkRounded";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import PushPinRoundedIcon from "@mui/icons-material/PushPinRounded";

import { RootState } from "../../redux/store";
import { SET_RECEIVER_ID } from "../../redux/features/chat/conversationSlice";
import {
  SET_NEW_GROUP_MODAL_OPEN,
  SET_INVITE_FRIEND_MODAL_OPEN,
  SET_ACTIVE_NAV_TAB,
} from "../../redux/features/settings/settingsSlice";
import { PURPLE_PRIMARY } from "../../theme";
import { TUser } from "../../types";

export const GroupsSidebar: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const { allUsers = [] } = useSelector((state: RootState) => state.auth);
  const { receiverId } = useSelector((state: RootState) => state.message);
  const { compactList } = useSelector((state: RootState) => state.settings);

  const [searchQuery, setSearchQuery] = useState("");
  const [plusMenuAnchor, setPlusMenuAnchor] = useState<null | HTMLElement>(null);

  const groupsList: TUser[] = useMemo(() => {
    return (allUsers || []).filter((u: TUser) => !!u.isGroup);
  }, [allUsers]);

  const filteredGroups = useMemo(() => {
    return groupsList.filter((g) => {
      if (!searchQuery.trim()) return true;
      return g.name?.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [groupsList, searchQuery]);

  const handleSelectGroup = (id: string) => {
    dispatch(SET_RECEIVER_ID(id));
    dispatch(SET_ACTIVE_NAV_TAB("chats"));
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: theme.palette.mode === "dark" ? theme.palette.background.paper : "#F8F9FB",
        borderRight: `1px solid ${theme.palette.divider}`,
        overflow: "hidden",
      }}
    >
      {/* ── Top Header ── */}
      <Box
        sx={{
          px: 2.5,
          py: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.15rem", color: theme.palette.text.primary }}>
          Groups
        </Typography>

        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <Tooltip title="Group Actions" arrow>
            <IconButton
              onClick={(e) => setPlusMenuAnchor(e.currentTarget)}
              sx={{
                width: 32,
                height: 32,
                backgroundColor: PURPLE_PRIMARY,
                color: "#FFFFFF",
                borderRadius: "50%",
                "&:hover": { backgroundColor: "#6D28D9" },
              }}
            >
              <AddRoundedIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Tooltip>

          <IconButton size="small" sx={{ color: theme.palette.text.secondary }}>
            <MoreVertRoundedIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Stack>
      </Box>

      {/* Plus Menu: Join With Invite Link / Invite Others */}
      <Menu
        anchorEl={plusMenuAnchor}
        open={Boolean(plusMenuAnchor)}
        onClose={() => setPlusMenuAnchor(null)}
        slotProps={{
          paper: {
            sx: {
              minWidth: 200,
              borderRadius: "12px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            },
          },
        }}
      >
        <MenuItem
          onClick={() => {
            setPlusMenuAnchor(null);
            dispatch(SET_NEW_GROUP_MODAL_OPEN(true));
          }}
        >
          <ListItemIcon>
            <AddRoundedIcon fontSize="small" sx={{ color: PURPLE_PRIMARY }} />
          </ListItemIcon>
          <ListItemText primary="New Group" />
        </MenuItem>
        <MenuItem
          onClick={() => {
            setPlusMenuAnchor(null);
            dispatch(SET_INVITE_FRIEND_MODAL_OPEN(true));
          }}
        >
          <ListItemIcon>
            <LinkRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Join With Invite Link" />
        </MenuItem>
        <MenuItem
          onClick={() => {
            setPlusMenuAnchor(null);
            dispatch(SET_INVITE_FRIEND_MODAL_OPEN(true));
          }}
        >
          <ListItemIcon>
            <PersonAddAltRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Invite Others" />
        </MenuItem>
      </Menu>

      {/* ── Search Input ── */}
      <Box sx={{ px: 2.5, pb: 1.5 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search Groups"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <SearchRoundedIcon sx={{ color: theme.palette.text.secondary, fontSize: 18 }} />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: theme.palette.mode === "dark" ? alpha("#FFFFFF", 0.05) : "#FFFFFF",
              borderRadius: "10px",
              height: 38,
              fontSize: "0.8125rem",
              "& fieldset": { borderColor: theme.palette.divider },
              "&:hover fieldset": { borderColor: PURPLE_PRIMARY },
            },
          }}
        />
      </Box>

      {/* ── All Groups Header ── */}
      <Box sx={{ px: 2.5, py: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: "0.875rem" }}>
          All Groups ({filteredGroups.length})
        </Typography>
      </Box>

      {/* ── Scrollable Groups List ── */}
      <Box sx={{ flex: 1, overflowY: "auto", px: 2.5, pb: 2 }}>
        <Stack spacing={compactList ? 0.75 : 1}>
          {filteredGroups.map((group) => {
            const isSelected = String(receiverId) === String(group.id);
            const count = group.memberCount || group.members?.length || 4;

            return (
              <Box
                key={group.id}
                onClick={() => handleSelectGroup(String(group.id))}
                sx={{
                  cursor: "pointer",
                  p: compactList ? 1 : 1.25,
                  borderRadius: "10px",
                  backgroundColor: isSelected
                    ? theme.palette.mode === "dark"
                      ? alpha(PURPLE_PRIMARY, 0.15)
                      : "#FFFFFF"
                    : theme.palette.mode === "dark"
                    ? alpha("#FFFFFF", 0.02)
                    : "#FFFFFF",
                  border: isSelected
                    ? `1.5px solid ${PURPLE_PRIMARY}`
                    : `1px solid ${theme.palette.divider}`,
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  transition: "all 150ms ease",
                  "&:hover": {
                    borderColor: PURPLE_PRIMARY,
                    backgroundColor: theme.palette.mode === "dark" ? alpha("#FFFFFF", 0.05) : "#FFFFFF",
                  },
                }}
              >
                <Avatar
                  src={group.avatar || group.img}
                  alt={group.name}
                  sx={{
                    width: compactList ? 38 : 44,
                    height: compactList ? 38 : 44,
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    backgroundColor: alpha(PURPLE_PRIMARY, 0.15),
                    color: PURPLE_PRIMARY,
                  }}
                >
                  {group.name?.[0]?.toUpperCase()}
                </Avatar>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography noWrap variant="subtitle2" sx={{ fontWeight: 600, fontSize: "0.85rem" }}>
                    {group.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: "block" }}>
                    {count} members
                  </Typography>
                </Box>

                {group.isPinned && (
                  <PushPinRoundedIcon sx={{ fontSize: 15, color: PURPLE_PRIMARY, transform: "rotate(45deg)" }} />
                )}
              </Box>
            );
          })}
        </Stack>
      </Box>
    </Box>
  );
};

export default GroupsSidebar;
