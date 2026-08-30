/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  Avatar,
  Badge,
  Tooltip,
  Stack,
  Tabs,
  Tab,
  Button,
  Chip,
  CircularProgress,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";

import { RootState } from "../../redux/store";
import {
  SET_CONTACT_DETAIL_MODAL,
  SET_INVITE_FRIEND_MODAL_OPEN,
} from "../../redux/features/settings/settingsSlice";
import { getFriends, acceptFriendApi, unblockUserAPI, inviteUserApi } from "../../services/auth";
import { PURPLE_PRIMARY, STATUS_ONLINE } from "../../theme";
import { showToast } from "../../utils/toast";
import { SUCCESS, FAILED } from "../../constants/common";
import { TUser } from "../../types";

export const ContactsSidebar: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { allUsers = [], activeUsers = [], loginUser } = useSelector(
    (state: RootState) => state.auth
  );
  const { compactList } = useSelector((state: RootState) => state.settings);

  const [activeTab, setActiveTab] = useState<"contacts" | "invitations">("contacts");
  const [searchQuery, setSearchQuery] = useState("");
  const [connections, setConnections] = useState<any[]>([]);
  const [isLoadingConnections, setIsLoadingConnections] = useState(false);

  const loadConnections = async () => {
    try {
      setIsLoadingConnections(true);
      const res = await getFriends({});
      if (res?.success && Array.isArray(res.data)) {
        setConnections(res.data);
      }
    } catch (err) {
      console.error("Failed to load friend connections:", err);
    } finally {
      setIsLoadingConnections(false);
    }
  };

  useEffect(() => {
    void loadConnections();
  }, []);

  const contactsList: TUser[] = useMemo(() => {
    return (allUsers || []).filter(
      (u: TUser) => String(u.id) !== String(loginUser?.id) && !u.isGroup
    );
  }, [allUsers, loginUser]);

  const filteredContacts = useMemo(() => {
    return contactsList.filter((item) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.name?.toLowerCase().includes(q) ||
        item.role?.toLowerCase().includes(q) ||
        item.email?.toLowerCase().includes(q)
      );
    });
  }, [contactsList, searchQuery]);

  const favourites = useMemo(() => {
    return filteredContacts.filter((c) => c.isFavourite);
  }, [filteredContacts]);

  const groupedContacts = useMemo(() => {
    const groups: { [key: string]: TUser[] } = {};
    filteredContacts.forEach((contact) => {
      const firstLetter = (contact.name?.[0] || "A").toUpperCase();
      if (!groups[firstLetter]) {
        groups[firstLetter] = [];
      }
      groups[firstLetter].push(contact);
    });
    return Object.keys(groups)
      .sort()
      .reduce((acc, key) => {
        acc[key] = groups[key];
        return acc;
      }, {} as { [key: string]: TUser[] });
  }, [filteredContacts]);

  // Invitations categorization
  const incomingRequests = useMemo(() => {
    return connections.filter(
      (c) => c.invite_status?.toUpperCase() === "PENDING" && c.request_direction === "incoming"
    );
  }, [connections]);

  const outgoingRequests = useMemo(() => {
    return connections.filter(
      (c) => c.invite_status?.toUpperCase() === "PENDING" && c.request_direction === "outgoing"
    );
  }, [connections]);

  const blockedUsers = useMemo(() => {
    return connections.filter((c) => Boolean(c.is_blocked));
  }, [connections]);

  const totalPendingCount = incomingRequests.length;

  const handleOpenContactDetail = (contact: TUser) => {
    dispatch(SET_CONTACT_DETAIL_MODAL({ open: true, contact }));
  };

  const handleAcceptInvite = async (friendshipId?: number, userId?: number) => {
    try {
      const res = await acceptFriendApi({ friendshipId, userId });
      if (res?.success) {
        showToast(SUCCESS, "Friend invitation accepted!");
        await loadConnections();
      } else {
        showToast(FAILED, res?.message || "Failed to accept");
      }
    } catch (err) {
      console.error("Error accepting invite:", err);
      showToast(FAILED, "Failed to accept invite");
    }
  };

  const handleUnblock = async (userId: number | string) => {
    try {
      const res = await unblockUserAPI({ friendId: userId });
      if (res?.success) {
        showToast(SUCCESS, "User unblocked");
        await loadConnections();
      } else {
        showToast(FAILED, res?.message || "Failed to unblock");
      }
    } catch (err) {
      console.error("Error unblocking:", err);
      showToast(FAILED, "Failed to unblock");
    }
  };

  const handleResendInvite = async (targetEmail: string) => {
    try {
      const res = await inviteUserApi({ email: targetEmail, message: "Hey! Let's connect on Chatty." });
      if (res?.success) {
        showToast(SUCCESS, `Invitation re-sent to ${targetEmail}`);
        await loadConnections();
      }
    } catch (err) {
      showToast(FAILED, "Failed to re-send invitation");
    }
  };

  const handleCopyLink = async () => {
    const link = `${window.location.origin}/invite?id=${loginUser?.id}`;
    try {
      await navigator.clipboard.writeText(link);
      showToast(SUCCESS, "Invitation link copied to clipboard!");
    } catch {
      showToast(FAILED, "Failed to copy link");
    }
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
          Contacts
        </Typography>

        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <Tooltip title="Add / Invite Friend" arrow>
            <IconButton
              onClick={() => dispatch(SET_INVITE_FRIEND_MODAL_OPEN(true))}
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

          <Tooltip title="Manage in full page" arrow>
            <IconButton size="small" onClick={() => navigate("/manageUser")} sx={{ color: theme.palette.text.secondary }}>
              <OpenInNewRoundedIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>

      {/* ── Sub Tabs: Contacts / Invitations ── */}
      <Box sx={{ px: 2.5, pb: 1.5 }}>
        <Tabs
          value={activeTab}
          onChange={(_, val) => setActiveTab(val)}
          sx={{
            backgroundColor: theme.palette.mode === "dark" ? alpha("#FFFFFF", 0.04) : "#F3F4F6",
            borderRadius: "10px",
            p: 0.5,
            minHeight: "auto",
            "& .MuiTabs-indicator": { display: "none" },
          }}
        >
          <Tab
            value="contacts"
            icon={<PeopleAltRoundedIcon sx={{ fontSize: 16 }} />}
            iconPosition="start"
            label={`Contacts (${contactsList.length})`}
            sx={{
              borderRadius: "8px",
              minHeight: 32,
              py: 0.35,
              px: 1.5,
              fontSize: "0.75rem",
              fontWeight: 600,
              flex: 1,
              color: theme.palette.text.secondary,
              "&.Mui-selected": {
                backgroundColor: theme.palette.mode === "dark" ? theme.palette.background.paper : "#FFFFFF",
                color: PURPLE_PRIMARY,
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              },
            }}
          />
          <Tab
            value="invitations"
            icon={<PersonAddAltRoundedIcon sx={{ fontSize: 16 }} />}
            iconPosition="start"
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <span>Requests</span>
                {totalPendingCount > 0 && (
                  <Chip
                    label={totalPendingCount}
                    size="small"
                    sx={{
                      height: 16,
                      fontSize: "0.65rem",
                      backgroundColor: PURPLE_PRIMARY,
                      color: "#FFFFFF",
                      fontWeight: 700,
                      px: 0.25,
                    }}
                  />
                )}
              </Box>
            }
            sx={{
              borderRadius: "8px",
              minHeight: 32,
              py: 0.35,
              px: 1.5,
              fontSize: "0.75rem",
              fontWeight: 600,
              flex: 1,
              color: theme.palette.text.secondary,
              "&.Mui-selected": {
                backgroundColor: theme.palette.mode === "dark" ? theme.palette.background.paper : "#FFFFFF",
                color: PURPLE_PRIMARY,
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              },
            }}
          />
        </Tabs>
      </Box>

      {activeTab === "contacts" ? (
        /* ── CONTACTS TAB ── */
        <>
          {/* ── Search Input ── */}
          <Box sx={{ px: 2.5, pb: 1.5 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search Contacts"
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

          {/* ── List Title: All Contacts (10) ── */}
          <Box
            sx={{
              px: 2.5,
              py: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: "0.875rem" }}>
              All Contacts ({contactsList.length})
            </Typography>

            <IconButton size="small" sx={{ color: theme.palette.text.secondary, p: 0.5 }}>
              <FilterListRoundedIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>

          {/* ── Scrollable Contacts List ── */}
          <Box sx={{ flex: 1, overflowY: "auto", px: 2.5, pb: 2 }}>
            {/* Favourites Section */}
            {favourites.length > 0 && !searchQuery && (
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 700,
                    color: theme.palette.text.secondary,
                    fontSize: "0.75rem",
                    display: "block",
                    mb: 1,
                  }}
                >
                  Favourites
                </Typography>

                {favourites.map((contact) => {
                  const isOnline = contact.isOnline || activeUsers.includes(String(contact.id));
                  return (
                    <Box
                      key={`fav-${contact.id}`}
                      onClick={() => handleOpenContactDetail(contact)}
                      sx={{
                        cursor: "pointer",
                        p: 1.25,
                        borderRadius: "10px",
                        backgroundColor: theme.palette.mode === "dark" ? alpha("#FFFFFF", 0.02) : "#FFFFFF",
                        border: `1px solid ${theme.palette.divider}`,
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        mb: 1,
                        transition: "all 150ms ease",
                        "&:hover": {
                          borderColor: PURPLE_PRIMARY,
                          backgroundColor: theme.palette.mode === "dark" ? alpha("#FFFFFF", 0.05) : "#FFFFFF",
                        },
                      }}
                    >
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
                          src={contact.avatar || contact.img}
                          alt={contact.name}
                          sx={{
                            width: 44,
                            height: 44,
                            fontSize: "0.85rem",
                            fontWeight: 700,
                            backgroundColor: alpha(PURPLE_PRIMARY, 0.12),
                            color: PURPLE_PRIMARY,
                          }}
                        >
                          {contact.name?.[0]?.toUpperCase()}
                        </Avatar>
                      </Badge>

                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <Typography noWrap variant="subtitle2" sx={{ fontWeight: 600, fontSize: "0.85rem" }}>
                            {contact.name}
                          </Typography>
                          <FavoriteRoundedIcon sx={{ fontSize: 13, color: "#EF4444" }} />
                        </Box>
                        <Typography noWrap variant="caption" sx={{ color: theme.palette.text.secondary, display: "block" }}>
                          {contact.role || "Contact"}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: STATUS_ONLINE,
                            fontWeight: 600,
                            fontSize: "0.7rem",
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          • Online
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            )}

            {/* Alphabetical Sections */}
            {Object.keys(groupedContacts).map((letter) => (
              <Box key={letter} sx={{ mb: 2 }}>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 700,
                    color: theme.palette.text.secondary,
                    fontSize: "0.75rem",
                    display: "block",
                    mb: 1,
                    px: 0.5,
                  }}
                >
                  {letter}
                </Typography>

                <Stack spacing={compactList ? 0.75 : 1}>
                  {groupedContacts[letter].map((contact) => {
                    const isOnline = contact.isOnline || activeUsers.includes(String(contact.id));
                    return (
                      <Box
                        key={contact.id}
                        onClick={() => handleOpenContactDetail(contact)}
                        sx={{
                          cursor: "pointer",
                          p: compactList ? 1 : 1.25,
                          borderRadius: "10px",
                          backgroundColor: theme.palette.mode === "dark" ? alpha("#FFFFFF", 0.02) : "#FFFFFF",
                          border: `1px solid ${theme.palette.divider}`,
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
                            src={contact.avatar || contact.img}
                            alt={contact.name}
                            sx={{
                              width: compactList ? 38 : 44,
                              height: compactList ? 38 : 44,
                              fontSize: "0.85rem",
                              fontWeight: 700,
                              backgroundColor: alpha(PURPLE_PRIMARY, 0.12),
                              color: PURPLE_PRIMARY,
                            }}
                          >
                            {contact.name?.[0]?.toUpperCase()}
                          </Avatar>
                        </Badge>

                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography noWrap variant="subtitle2" sx={{ fontWeight: 600, fontSize: "0.85rem" }}>
                            {contact.name}
                          </Typography>
                          <Typography noWrap variant="caption" sx={{ color: theme.palette.text.secondary, display: "block" }}>
                            {contact.role || "Contact"}
                          </Typography>

                          {isOnline ? (
                            <Typography variant="caption" sx={{ color: STATUS_ONLINE, fontWeight: 600, fontSize: "0.7rem" }}>
                              • Online
                            </Typography>
                          ) : (
                            <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontSize: "0.7rem" }}>
                              • Offline
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    );
                  })}
                </Stack>
              </Box>
            ))}
          </Box>
        </>
      ) : (
        /* ── INVITATIONS & REQUESTS TAB ── */
        <Box sx={{ flex: 1, overflowY: "auto", px: 2.5, pb: 2 }}>
          {isLoadingConnections ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            <Stack spacing={2.5}>
              {/* Incoming Requests Section */}
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 700, color: theme.palette.text.secondary, display: "block", mb: 1 }}>
                  INCOMING REQUESTS ({incomingRequests.length})
                </Typography>

                {incomingRequests.length === 0 ? (
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontSize: "0.8rem", fontStyle: "italic", py: 0.5 }}>
                    No pending incoming requests.
                  </Typography>
                ) : (
                  <Stack spacing={1}>
                    {incomingRequests.map((req) => (
                      <Box
                        key={req.friendship_id || req.id}
                        sx={{
                          p: 1.25,
                          borderRadius: "10px",
                          border: `1px solid ${theme.palette.divider}`,
                          backgroundColor: theme.palette.mode === "dark" ? alpha("#FFFFFF", 0.02) : "#FFFFFF",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 1 }}>
                          <Avatar src={req.img} sx={{ width: 34, height: 34, fontSize: "0.8rem", backgroundColor: alpha(PURPLE_PRIMARY, 0.15), color: PURPLE_PRIMARY }}>
                            {(req.name || req.email)?.[0]?.toUpperCase()}
                          </Avatar>
                          <Box sx={{ minWidth: 0, flex: 1 }}>
                            <Typography noWrap variant="subtitle2" sx={{ fontWeight: 600, fontSize: "0.825rem" }}>
                              {req.name || req.email}
                            </Typography>
                            <Typography noWrap variant="caption" sx={{ color: theme.palette.text.secondary, fontSize: "0.7rem" }}>
                              {req.email}
                            </Typography>
                          </Box>
                        </Box>

                        <Stack direction="row" spacing={1}>
                          <Button
                            fullWidth
                            size="small"
                            variant="contained"
                            onClick={() => handleAcceptInvite(req.friendship_id, req.id)}
                            startIcon={<CheckRoundedIcon sx={{ fontSize: 15 }} />}
                            sx={{
                              backgroundColor: PURPLE_PRIMARY,
                              fontSize: "0.72rem",
                              py: 0.4,
                              "&:hover": { backgroundColor: "#6D28D9" },
                            }}
                          >
                            Accept
                          </Button>
                        </Stack>
                      </Box>
                    ))}
                  </Stack>
                )}
              </Box>

              {/* Outgoing Requests Section */}
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 700, color: theme.palette.text.secondary, display: "block", mb: 1 }}>
                  SENT INVITATIONS ({outgoingRequests.length})
                </Typography>

                {outgoingRequests.length === 0 ? (
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontSize: "0.8rem", fontStyle: "italic", py: 0.5 }}>
                    No pending sent invitations.
                  </Typography>
                ) : (
                  <Stack spacing={1}>
                    {outgoingRequests.map((req) => (
                      <Box
                        key={req.friendship_id || req.id}
                        sx={{
                          p: 1.25,
                          borderRadius: "10px",
                          border: `1px solid ${theme.palette.divider}`,
                          backgroundColor: theme.palette.mode === "dark" ? alpha("#FFFFFF", 0.02) : "#FFFFFF",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.75 }}>
                          <Box sx={{ minWidth: 0, flex: 1 }}>
                            <Typography noWrap variant="subtitle2" sx={{ fontWeight: 600, fontSize: "0.825rem" }}>
                              {req.name || req.receiver_email || req.email}
                            </Typography>
                            <Typography noWrap variant="caption" sx={{ color: theme.palette.text.secondary, fontSize: "0.7rem" }}>
                              {req.email || req.receiver_email}
                            </Typography>
                          </Box>
                          <Chip size="small" label="Pending" sx={{ height: 20, fontSize: "0.65rem", fontWeight: 700 }} />
                        </Box>

                        <Stack direction="row" spacing={1}>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleResendInvite(req.email || req.receiver_email)}
                            sx={{ flex: 1, fontSize: "0.7rem", py: 0.3 }}
                          >
                            Re-send
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleCopyLink()}
                            startIcon={<ContentCopyRoundedIcon sx={{ fontSize: 13 }} />}
                            sx={{ flex: 1, fontSize: "0.7rem", py: 0.3 }}
                          >
                            Copy Link
                          </Button>
                        </Stack>
                      </Box>
                    ))}
                  </Stack>
                )}
              </Box>

              {/* Blocked Users Section */}
              {blockedUsers.length > 0 && (
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: "error.main", display: "block", mb: 1 }}>
                    BLOCKED USERS ({blockedUsers.length})
                  </Typography>

                  <Stack spacing={1}>
                    {blockedUsers.map((u) => (
                      <Box
                        key={u.id}
                        sx={{
                          p: 1.25,
                          borderRadius: "10px",
                          border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          backgroundColor: alpha(theme.palette.error.main, 0.04),
                        }}
                      >
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <Typography noWrap variant="subtitle2" sx={{ fontWeight: 600, fontSize: "0.825rem" }}>
                            {u.name || u.email}
                          </Typography>
                          <Typography noWrap variant="caption" sx={{ color: theme.palette.text.secondary, fontSize: "0.7rem" }}>
                            {u.email}
                          </Typography>
                        </Box>

                        <Button
                          size="small"
                          color="success"
                          variant="outlined"
                          onClick={() => handleUnblock(u.id)}
                          startIcon={<LockOpenOutlinedIcon sx={{ fontSize: 14 }} />}
                          sx={{ fontSize: "0.7rem", py: 0.3, px: 1 }}
                        >
                          Unblock
                        </Button>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              )}
            </Stack>
          )}
        </Box>
      )}
    </Box>
  );
};

export default ContactsSidebar;
