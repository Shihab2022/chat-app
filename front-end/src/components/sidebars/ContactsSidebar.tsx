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
  Tooltip,
  Stack,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";

import { RootState } from "../../redux/store";
import {
  SET_CONTACT_DETAIL_MODAL,
  SET_INVITE_FRIEND_MODAL_OPEN,
} from "../../redux/features/settings/settingsSlice";
import { PURPLE_PRIMARY, STATUS_ONLINE } from "../../theme";
import { TUser } from "../../types";

export const ContactsSidebar: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const { allUsers = [], activeUsers = [], loginUser } = useSelector(
    (state: RootState) => state.auth
  );
  const { compactList } = useSelector((state: RootState) => state.settings);

  const [searchQuery, setSearchQuery] = useState("");

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

  const handleOpenContactDetail = (contact: TUser) => {
    dispatch(SET_CONTACT_DETAIL_MODAL({ open: true, contact }));
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
          <Tooltip title="Add / Invite Contact" arrow>
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

          <IconButton size="small" sx={{ color: theme.palette.text.secondary }}>
            <MoreVertRoundedIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Stack>
      </Box>

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
                      {contact.role || "Product designer at Dreams"}
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
                        {contact.role || "Frontend engineer"}
                      </Typography>

                      {contact.isTyping ? (
                        <Typography variant="caption" sx={{ color: PURPLE_PRIMARY, fontWeight: 600, fontSize: "0.7rem" }}>
                          ... typing...
                        </Typography>
                      ) : contact.isRecordingAudio ? (
                        <Typography variant="caption" sx={{ color: PURPLE_PRIMARY, fontWeight: 600, fontSize: "0.7rem" }}>
                          🎙️ recording audio...
                        </Typography>
                      ) : contact.lastSeen ? (
                        <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontSize: "0.7rem" }}>
                          🕒 {contact.lastSeen}
                        </Typography>
                      ) : (
                        <Typography variant="caption" sx={{ color: STATUS_ONLINE, fontWeight: 600, fontSize: "0.7rem" }}>
                          • Online
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
    </Box>
  );
};

export default ContactsSidebar;
