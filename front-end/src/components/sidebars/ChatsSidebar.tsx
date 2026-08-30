/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  Avatar,
  Badge,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Stack,
  Divider,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import DoneAllRoundedIcon from "@mui/icons-material/DoneAllRounded";
import GroupAddRoundedIcon from "@mui/icons-material/GroupAddRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import ArchiveRoundedIcon from "@mui/icons-material/ArchiveRounded";
import PushPinRoundedIcon from "@mui/icons-material/PushPinRounded";

import { RootState } from "../../redux/store";
import { SET_RECEIVER_ID } from "../../redux/features/chat/conversationSlice";
import {
  SET_NEW_CHAT_MODAL_OPEN,
  SET_NEW_GROUP_MODAL_OPEN,
  SET_ARCHIVED_CHATS_OPEN,
} from "../../redux/features/settings/settingsSlice";
import { PURPLE_PRIMARY, STATUS_ONLINE, BADGE_UNREAD } from "../../theme";
import { TUser } from "../../types";
import {
  formattedSideBarData,
  getLastMessagePreview,
  getLastMessageTime,
} from "../../utils/common";

type FilterTab = "all" | "unread" | "favourites" | "groups";

export const ChatsSidebar: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const { allUsers = [], activeUsers = [], loginUser } = useSelector(
    (state: RootState) => state.auth
  );
  const { receiverId } = useSelector((state: RootState) => state.message);
  const { compactList } = useSelector((state: RootState) => state.settings);

  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [plusMenuAnchor, setPlusMenuAnchor] = useState<null | HTMLElement>(null);
  const [filterMenuAnchor, setFilterMenuAnchor] = useState<null | HTMLElement>(null);

  const conversationList: TUser[] = useMemo(() => {
    const realUsers = (allUsers || []).filter(
      (u: TUser) => String(u.id) !== String(loginUser?.id)
    );
    return formattedSideBarData(realUsers);
  }, [allUsers, loginUser]);

  const filteredConversations = useMemo(() => {
    return conversationList.filter((item) => {
      if (searchQuery.trim()) {
        const preview = getLastMessagePreview(item.lastMessage).toLowerCase();
        const matchesName = item.name?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesMsg = preview.includes(searchQuery.toLowerCase());
        if (!matchesName && !matchesMsg) return false;
      }

      if (activeFilter === "unread") {
        return (item.unreadCount || 0) > 0;
      }
      if (activeFilter === "favourites") {
        return !!item.isFavourite;
      }
      if (activeFilter === "groups") {
        return !!item.isGroup;
      }

      return true;
    });
  }, [conversationList, searchQuery, activeFilter]);

  const handleSelectChat = (id: string) => {
    dispatch(SET_RECEIVER_ID(id));
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
          Chats
        </Typography>

        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          {/* Circular Purple Plus Button matching PDF */}
          <Tooltip title="New Chat / Group" arrow>
            <IconButton
              onClick={(e) => setPlusMenuAnchor(e.currentTarget)}
              sx={{
                width: 32,
                height: 32,
                backgroundColor: PURPLE_PRIMARY,
                color: "#FFFFFF",
                borderRadius: "50%",
                boxShadow: `0 2px 8px ${alpha(PURPLE_PRIMARY, 0.35)}`,
                "&:hover": {
                  backgroundColor: "#6D28D9",
                },
              }}
            >
              <AddRoundedIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Tooltip>

          {/* Plus Actions Menu */}
          <Menu
            anchorEl={plusMenuAnchor}
            open={Boolean(plusMenuAnchor)}
            onClose={() => setPlusMenuAnchor(null)}
            slotProps={{
              paper: {
                sx: {
                  minWidth: 180,
                  borderRadius: "12px",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                },
              },
            }}
          >
            <MenuItem
              onClick={() => {
                setPlusMenuAnchor(null);
                dispatch(SET_NEW_CHAT_MODAL_OPEN(true));
              }}
            >
              <ListItemIcon>
                <ChatBubbleOutlineRoundedIcon fontSize="small" sx={{ color: PURPLE_PRIMARY }} />
              </ListItemIcon>
              <ListItemText primary="New Chat" />
            </MenuItem>
            <MenuItem
              onClick={() => {
                setPlusMenuAnchor(null);
                dispatch(SET_NEW_GROUP_MODAL_OPEN(true));
              }}
            >
              <ListItemIcon>
                <GroupAddRoundedIcon fontSize="small" sx={{ color: PURPLE_PRIMARY }} />
              </ListItemIcon>
              <ListItemText primary="New Group" />
            </MenuItem>
            <Divider sx={{ my: 0.5 }} />
            <MenuItem
              onClick={() => {
                setPlusMenuAnchor(null);
                dispatch(SET_ARCHIVED_CHATS_OPEN(true));
              }}
            >
              <ListItemIcon>
                <ArchiveRoundedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Archived Chats" />
            </MenuItem>
          </Menu>

          <IconButton size="small" sx={{ color: theme.palette.text.secondary }}>
            <MoreVertRoundedIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Stack>
      </Box>

      {/* ── Search Input matching PDF ── */}
      <Box sx={{ px: 2.5, pb: 1.5 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search Chats"
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
              "& fieldset": {
                borderColor: theme.palette.divider,
              },
              "&:hover fieldset": {
                borderColor: PURPLE_PRIMARY,
              },
            },
          }}
        />
      </Box>

      {/* ── Filter Chips matching PDF Page 1 ── */}
      <Box
        sx={{
          px: 2.5,
          pb: 1.5,
          display: "flex",
          alignItems: "center",
          gap: 0.75,
          overflowX: "auto",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        <Chip
          label="All"
          size="small"
          onClick={() => setActiveFilter("all")}
          sx={{
            borderRadius: "8px",
            fontSize: "0.75rem",
            fontWeight: 600,
            height: 28,
            cursor: "pointer",
            backgroundColor: activeFilter === "all" ? PURPLE_PRIMARY : theme.palette.mode === "dark" ? alpha("#FFFFFF", 0.05) : "#FFFFFF",
            color: activeFilter === "all" ? "#FFFFFF" : theme.palette.text.secondary,
            border: `1px solid ${activeFilter === "all" ? PURPLE_PRIMARY : theme.palette.divider}`,
            "&:hover": {
              backgroundColor: activeFilter === "all" ? PURPLE_PRIMARY : alpha(PURPLE_PRIMARY, 0.08),
            },
          }}
        />

        <Chip
          label={
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <span>Unread</span>
              <Box
                sx={{
                  backgroundColor: activeFilter === "unread" ? "#FFFFFF" : BADGE_UNREAD,
                  color: activeFilter === "unread" ? PURPLE_PRIMARY : "#FFFFFF",
                  borderRadius: "50%",
                  width: 15,
                  height: 15,
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                1
              </Box>
            </Box>
          }
          size="small"
          onClick={() => setActiveFilter("unread")}
          sx={{
            borderRadius: "8px",
            fontSize: "0.75rem",
            fontWeight: 600,
            height: 28,
            cursor: "pointer",
            backgroundColor: activeFilter === "unread" ? PURPLE_PRIMARY : theme.palette.mode === "dark" ? alpha("#FFFFFF", 0.05) : "#FFFFFF",
            color: activeFilter === "unread" ? "#FFFFFF" : theme.palette.text.secondary,
            border: `1px solid ${activeFilter === "unread" ? PURPLE_PRIMARY : theme.palette.divider}`,
            "&:hover": {
              backgroundColor: activeFilter === "unread" ? PURPLE_PRIMARY : alpha(PURPLE_PRIMARY, 0.08),
            },
          }}
        />

        <Chip
          label="Favourites"
          size="small"
          onClick={() => setActiveFilter("favourites")}
          sx={{
            borderRadius: "8px",
            fontSize: "0.75rem",
            fontWeight: 600,
            height: 28,
            cursor: "pointer",
            backgroundColor: activeFilter === "favourites" ? PURPLE_PRIMARY : theme.palette.mode === "dark" ? alpha("#FFFFFF", 0.05) : "#FFFFFF",
            color: activeFilter === "favourites" ? "#FFFFFF" : theme.palette.text.secondary,
            border: `1px solid ${activeFilter === "favourites" ? PURPLE_PRIMARY : theme.palette.divider}`,
            "&:hover": {
              backgroundColor: activeFilter === "favourites" ? PURPLE_PRIMARY : alpha(PURPLE_PRIMARY, 0.08),
            },
          }}
        />

        <Chip
          label="Group"
          size="small"
          onClick={() => setActiveFilter("groups")}
          sx={{
            borderRadius: "8px",
            fontSize: "0.75rem",
            fontWeight: 600,
            height: 28,
            cursor: "pointer",
            backgroundColor: activeFilter === "groups" ? PURPLE_PRIMARY : theme.palette.mode === "dark" ? alpha("#FFFFFF", 0.05) : "#FFFFFF",
            color: activeFilter === "groups" ? "#FFFFFF" : theme.palette.text.secondary,
            border: `1px solid ${activeFilter === "groups" ? PURPLE_PRIMARY : theme.palette.divider}`,
            "&:hover": {
              backgroundColor: activeFilter === "groups" ? PURPLE_PRIMARY : alpha(PURPLE_PRIMARY, 0.08),
            },
          }}
        />

        <IconButton
          size="small"
          onClick={(e) => setFilterMenuAnchor(e.currentTarget)}
          sx={{
            width: 28,
            height: 28,
            borderRadius: "8px",
            border: `1px solid ${theme.palette.divider}`,
            color: theme.palette.text.secondary,
            backgroundColor: theme.palette.mode === "dark" ? alpha("#FFFFFF", 0.05) : "#FFFFFF",
          }}
        >
          <FilterListRoundedIcon sx={{ fontSize: 16 }} />
        </IconButton>

        <Menu
          anchorEl={filterMenuAnchor}
          open={Boolean(filterMenuAnchor)}
          onClose={() => setFilterMenuAnchor(null)}
          slotProps={{
            paper: {
              sx: { borderRadius: "10px", minWidth: 150 },
            },
          }}
        >
          <MenuItem onClick={() => { setActiveFilter("all"); setFilterMenuAnchor(null); }}>Show All</MenuItem>
          <MenuItem onClick={() => { setActiveFilter("unread"); setFilterMenuAnchor(null); }}>Unread Only</MenuItem>
          <MenuItem onClick={() => { setActiveFilter("favourites"); setFilterMenuAnchor(null); }}>Favourites Only</MenuItem>
          <MenuItem onClick={() => { setActiveFilter("groups"); setFilterMenuAnchor(null); }}>Groups Only</MenuItem>
        </Menu>
      </Box>

      {/* ── Recent Chats Horizontal Avatar Carousel ── */}
      <Box sx={{ px: 2.5, py: 1, borderTop: `1px solid ${theme.palette.divider}`, borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Typography variant="caption" sx={{ fontWeight: 700, color: theme.palette.text.secondary, fontSize: "0.7rem", letterSpacing: "0.05em", display: "block", mb: 1 }}>
          RECENT CHATS
        </Typography>

        <Stack direction="row" spacing={1.5} sx={{ overflowX: "auto", pb: 0.5, "&::-webkit-scrollbar": { display: "none" } }}>
          {conversationList.slice(0, 7).map((user) => {
            const isOnline = user.isOnline || activeUsers.includes(String(user.id));
            return (
              <Box
                key={`recent-${user.id}`}
                onClick={() => handleSelectChat(String(user.id))}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  cursor: "pointer",
                  minWidth: 46,
                  transition: "transform 150ms ease",
                  "&:hover": { transform: "scale(1.05)" },
                }}
              >
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  variant={isOnline ? "dot" : "standard"}
                  sx={{
                    "& .MuiBadge-badge": {
                      backgroundColor: STATUS_ONLINE,
                      boxShadow: "0 0 0 2px #FFFFFF",
                      width: 9,
                      height: 9,
                      borderRadius: "50%",
                    },
                  }}
                >
                  <Avatar
                    src={user.avatar || user.img}
                    alt={user.name}
                    sx={{
                      width: 42,
                      height: 42,
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      backgroundColor: alpha(PURPLE_PRIMARY, 0.15),
                      color: PURPLE_PRIMARY,
                      border: String(receiverId) === String(user.id) ? `2px solid ${PURPLE_PRIMARY}` : "none",
                    }}
                  >
                    {user.name?.[0]?.toUpperCase()}
                  </Avatar>
                </Badge>
                <Typography noWrap variant="caption" sx={{ fontSize: "0.68rem", mt: 0.5, maxWidth: 50, textAlign: "center" }}>
                  {user.name?.split(" ")[0]}
                </Typography>
              </Box>
            );
          })}
        </Stack>
      </Box>

      {/* ── ALL CHATS Header ── */}
      <Box sx={{ px: 2.5, pt: 1.5, pb: 0.5 }}>
        <Typography variant="caption" sx={{ fontWeight: 700, color: theme.palette.text.secondary, fontSize: "0.7rem", letterSpacing: "0.05em" }}>
          ALL CHATS
        </Typography>
      </Box>

      {/* ── Scrollable Conversation List ── */}
      <Box sx={{ flex: 1, overflowY: "auto", px: 2.5, pb: 2 }}>
        <Stack spacing={compactList ? 0.75 : 1}>
          {filteredConversations.length === 0 ? (
            <Box sx={{ py: 4, textAlign: "center" }}>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontSize: "0.8125rem" }}>
                {searchQuery.trim() || activeFilter !== "all"
                  ? "No conversations match your search or filter."
                  : "No conversations yet. Start a new chat to get going."}
              </Typography>
            </Box>
          ) : (
          filteredConversations.map((item) => {
            const isSelected = String(receiverId) === String(item.id);
            const isOnline = item.isOnline || activeUsers.includes(String(item.id));

            return (
              <Box
                key={item.id}
                onClick={() => handleSelectChat(String(item.id))}
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
                  boxShadow: isSelected ? "0 2px 8px rgba(124, 58, 237, 0.08)" : "none",
                  "&:hover": {
                    borderColor: PURPLE_PRIMARY,
                    backgroundColor: theme.palette.mode === "dark" ? alpha("#FFFFFF", 0.05) : "#FFFFFF",
                  },
                }}
              >
                {/* Avatar with Online Dot */}
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  variant={isOnline ? "dot" : "standard"}
                  sx={{
                    flexShrink: 0,
                    "& .MuiBadge-badge": {
                      backgroundColor: STATUS_ONLINE,
                      boxShadow: "0 0 0 2px #FFFFFF",
                      width: 9,
                      height: 9,
                      borderRadius: "50%",
                    },
                  }}
                >
                  <Avatar
                    src={item.avatar || item.img}
                    alt={item.name}
                    sx={{
                      width: compactList ? 38 : 44,
                      height: compactList ? 38 : 44,
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      backgroundColor: alpha(PURPLE_PRIMARY, 0.12),
                      color: PURPLE_PRIMARY,
                    }}
                  >
                    {item.name?.[0]?.toUpperCase()}
                  </Avatar>
                </Badge>

                {/* Conversation Details */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.25 }}>
                    <Typography noWrap variant="subtitle2" sx={{ fontWeight: 600, fontSize: "0.85rem", color: theme.palette.text.primary }}>
                      {item.name}
                    </Typography>

                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontSize: "0.7rem", flexShrink: 0, ml: 1 }}>
                      {getLastMessageTime(item.lastMessage, item.time || "")}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    {item.isTyping ? (
                      <Typography variant="caption" sx={{ color: PURPLE_PRIMARY, fontWeight: 600, fontSize: "0.725rem" }}>
                        ... typing...
                      </Typography>
                    ) : (
                      <Typography noWrap variant="caption" sx={{ color: theme.palette.text.secondary, fontSize: "0.725rem", maxWidth: "80%" }}>
                        {getLastMessagePreview(item.lastMessage) || "No messages yet"}
                      </Typography>
                    )}

                    <Stack direction="row" spacing={0.5} sx={{ alignItems: "center", flexShrink: 0 }}>
                      {item.isPinned && (
                        <PushPinRoundedIcon sx={{ fontSize: 13, color: PURPLE_PRIMARY, transform: "rotate(45deg)" }} />
                      )}

                      {(item.unreadCount || 0) > 0 ? (
                        <Box
                          sx={{
                            backgroundColor: BADGE_UNREAD,
                            color: "#FFFFFF",
                            borderRadius: "50%",
                            width: 17,
                            height: 17,
                            fontSize: "0.65rem",
                            fontWeight: 700,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {item.unreadCount}
                        </Box>
                      ) : (
                        <DoneAllRoundedIcon sx={{ fontSize: 15, color: PURPLE_PRIMARY }} />
                      )}
                    </Stack>
                  </Box>
                </Box>
              </Box>
            );
          })
          )}
        </Stack>
      </Box>
    </Box>
  );
};

export default ChatsSidebar;
