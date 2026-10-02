import React, { useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Avatar,
  Badge,
  Chip,
  Button,
  IconButton,
  Tooltip,
  Divider,
  Stack,
} from "@mui/material";
import { motion } from "framer-motion";
import ChatBubbleRoundedIcon from "@mui/icons-material/ChatBubbleRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import DonutLargeRoundedIcon from "@mui/icons-material/DonutLargeRounded";
import CallRoundedIcon from "@mui/icons-material/CallRounded";
import AlternateEmailRoundedIcon from "@mui/icons-material/AlternateEmailRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import AttachFileRoundedIcon from "@mui/icons-material/AttachFileRounded";
import SentimentSatisfiedRoundedIcon from "@mui/icons-material/SentimentSatisfiedRounded";
import MicRoundedIcon from "@mui/icons-material/MicRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import DoneAllRoundedIcon from "@mui/icons-material/DoneAllRounded";
import PushPinRoundedIcon from "@mui/icons-material/PushPinRounded";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import QrCode2RoundedIcon from "@mui/icons-material/QrCode2Rounded";
import WallpaperRoundedIcon from "@mui/icons-material/WallpaperRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import { SectionTitle } from "../../components/SectionTitle";
import { COLORS, GRADIENTS } from "../../styles";
import { useNavigate } from "react-router-dom";
import { tokenKey } from "../../constants/common";

/** Mirrors `components/navigation/LeftNavigation.tsx` tab configuration. */
const NAV_ITEMS = [
  { id: "chats", label: "Chats", icon: ChatBubbleRoundedIcon },
  { id: "contacts", label: "Contacts", icon: PeopleAltRoundedIcon },
  { id: "groups", label: "Groups", icon: GroupsRoundedIcon },
  { id: "status", label: "Status", icon: DonutLargeRoundedIcon },
  { id: "calls", label: "Calls", icon: CallRoundedIcon },
  { id: "saved", label: "Mentions & Saved", icon: AlternateEmailRoundedIcon },
  { id: "settings", label: "Settings", icon: SettingsRoundedIcon },
];

interface ConversationRow {
  id: string;
  name: string;
  message: string;
  time: string;
  unread: number;
  online: boolean;
  color: string;
}

const CONVERSATIONS: ConversationRow[] = [
  {
    id: "sarah",
    name: "Sarah Jenkins",
    message: "Sure! Let's go 🎉",
    time: "10:43",
    unread: 0,
    online: true,
    color: "#7C4DFF",
  },
  {
    id: "design",
    name: "Design Team",
    message: "Emily: Uploaded 3 new mockups",
    time: "10:31",
    unread: 0,
    online: true,
    color: "#00E5FF",
  },
  {
    id: "alex",
    name: "Alex Rivera",
    message: "Voice message · 0:14",
    time: "09:58",
    unread: 2,
    online: false,
    color: "#FF4081",
  },
  {
    id: "frontend",
    name: "Frontend Crew",
    message: "You: Shipping the calls module today",
    time: "09:12",
    unread: 0,
    online: true,
    color: "#10B981",
  },
];

/** Dashboard capabilities surfaced as proof-point tiles beneath the mockup. */
const CAPABILITIES = [
  {
    id: "initiate",
    title: "Start conversations fast",
    description:
      "New chat, new group, invite by email or share a QR code — four entry points wired to the real API.",
    icon: <AddRoundedIcon />,
    gradient: GRADIENTS.brand,
  },
  {
    id: "realtime",
    title: "Live socket delivery",
    description:
      "Typing indicators, read receipts, reactions, replies, forwards and disappearing messages out of the box.",
    icon: <BoltRoundedIcon />,
    gradient: GRADIENTS.cyan,
  },
  {
    id: "calls",
    title: "Audio, video & history",
    description:
      "Incoming, outgoing and missed calls with persisted call logs you can review at any time.",
    icon: <VideocamRoundedIcon />,
    gradient: GRADIENTS.pink,
  },
  {
    id: "customise",
    title: "Make it yours",
    description:
      "Light or dark mode, chat wallpapers, font scaling, compact lists and per-chat preferences.",
    icon: <WallpaperRoundedIcon />,
    gradient: GRADIENTS.emerald,
  },
  {
    id: "teams",
    title: "Groups with roles",
    description:
      "Admins and members, invitations, group avatars and shared media — managed from one panel.",
    icon: <GroupsRoundedIcon />,
    gradient: GRADIENTS.indigo,
  },
  {
    id: "secure",
    title: "Secure by default",
    description:
      "JWT authentication, account confirmation, password reset and blocked-user controls.",
    icon: <LockRoundedIcon />,
    gradient: GRADIENTS.amber,
  },
];

const QUICK_ACTIONS = [
  { label: "New Chat", icon: <AddRoundedIcon sx={{ fontSize: 16 }} /> },
  { label: "New Group", icon: <GroupsRoundedIcon sx={{ fontSize: 16 }} /> },
  { label: "Invite Friend", icon: <PersonAddAltRoundedIcon sx={{ fontSize: 16 }} /> },
  { label: "QR Code", icon: <QrCode2RoundedIcon sx={{ fontSize: 16 }} /> },
  { label: "Wallpaper", icon: <WallpaperRoundedIcon sx={{ fontSize: 16 }} /> },
  { label: "Dark Mode", icon: <DarkModeRoundedIcon sx={{ fontSize: 16 }} /> },
];

/**
 * Interactive, pixel-faithful preview of the real Chatty dashboard.
 * Each region maps 1:1 to LeftNavigation, ChatsSidebar and ActiveChatView
 * so visitors can see exactly what the product ships.
 */
export const DashboardShowcase: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem(tokenKey);
  const [activeTab, setActiveTab] = useState("chats");
  const [activeConv, setActiveConv] = useState("sarah");
  const [activeFilter, setActiveFilter] = useState("all");

  const active = CONVERSATIONS.find((c) => c.id === activeConv) || CONVERSATIONS[0];

  return (
    <Box
      id="dashboard"
      sx={{ py: { xs: 8, md: 14 }, position: "relative", zIndex: 1 }}
    >
      <Container maxWidth="lg">
        <SectionTitle
          badge="DASHBOARD TOUR"
          title="One dashboard for"
          gradientWord="everything"
          subtitle="Chats, contacts, groups, status, calls, mentions and settings — every panel below ships in the live app."
        />

        {/* ── Quick action chips (mirror the real modals) ── */}
        <Stack
          direction="row"
          spacing={1}
          sx={{ flexWrap: "wrap", justifyContent: "center", gap: 1, mb: 5 }}
        >
          {QUICK_ACTIONS.map((action) => (
            <Chip
              key={action.label}
              icon={action.icon}
              label={action.label}
              size="small"
              sx={{
                color: "#E2E8F0",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                fontWeight: 600,
                fontSize: "0.78rem",
                "& .MuiChip-icon": { color: COLORS.secondary },
              }}
            />
          ))}
        </Stack>

        {/* ── Dashboard window mockup ── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Paper
            elevation={0}
            sx={{
              borderRadius: "18px",
              overflow: "hidden",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              background:
                "linear-gradient(160deg, rgba(23, 30, 51, 0.96) 0%, rgba(11, 18, 36, 0.98) 100%)",
              boxShadow:
                "0 30px 80px rgba(2, 6, 23, 0.7), 0 0 0 1px rgba(124, 77, 255, 0.16)",
            }}
          >
            {/* Window chrome */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 2,
                py: 1.2,
                borderBottom: "1px solid rgba(255, 255, 255, 0.07)",
                background: "rgba(255, 255, 255, 0.02)",
              }}
            >
              {["#FF5F57", "#FEBC2E", "#28C840"].map((dot) => (
                <Box
                  key={dot}
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    backgroundColor: dot,
                  }}
                />
              ))}
              <Box
                sx={{
                  flex: 1,
                  mx: 2,
                  height: 24,
                  borderRadius: "8px",
                  backgroundColor: "rgba(255, 255, 255, 0.04)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="caption" sx={{ color: COLORS.textSecondary }}>
                  chatty.app/chat
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", minHeight: { xs: 420, md: 520 } }}>
              {/* ── Nav rail (LeftNavigation) ── */}
              <Box
                sx={{
                  display: { xs: "none", sm: "flex" },
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 0.5,
                  width: 68,
                  flexShrink: 0,
                  py: 2,
                  px: 1,
                  borderRight: "1px solid rgba(255, 255, 255, 0.07)",
                  backgroundColor: "rgba(255, 255, 255, 0.02)",
                }}
              >
                <Box
                  sx={{
                    width: 34,
                    height: 34,
                    borderRadius: "10px",
                    background: GRADIENTS.brand,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                  }}
                >
                  <ChatBubbleRoundedIcon sx={{ color: "#FFFFFF", fontSize: 18 }} />
                </Box>

                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <Tooltip key={item.id} title={item.label} placement="right" arrow>
                      <IconButton
                        onClick={() => setActiveTab(item.id)}
                        aria-label={item.label}
                        sx={{
                          width: 40,
                          height: 40,
                          position: "relative",
                          borderRadius: "12px",
                          color: isActive ? "#FFFFFF" : "rgba(255, 255, 255, 0.45)",
                          "&:hover": { color: "#FFFFFF" },
                        }}
                      >
                        {isActive && (
                          <Box
                            sx={{
                              position: "absolute",
                              inset: 0,
                              borderRadius: "12px",
                              background: GRADIENTS.brand,
                              boxShadow: "0 6px 18px rgba(124, 77, 255, 0.45)",
                            }}
                          />
                        )}
                        <Icon sx={{ fontSize: 20, position: "relative", zIndex: 1 }} />
                      </IconButton>
                    </Tooltip>
                  );
                })}

                <Box sx={{ mt: "auto" }}>
                  <Avatar
                    sx={{
                      width: 34,
                      height: 34,
                      background: GRADIENTS.violet,
                      fontSize: "0.8rem",
                      fontWeight: 700,
                    }}
                  >
                    S
                  </Avatar>
                </Box>
              </Box>

              {/* ── Chats sidebar ── */}
              <Box
                sx={{
                  width: { xs: "100%", sm: 300, md: 320 },
                  flexShrink: 0,
                  display: "flex",
                  flexDirection: "column",
                  borderRight: {
                    xs: "none",
                    sm: "1px solid rgba(255, 255, 255, 0.07)",
                  },
                  backgroundColor: "rgba(255, 255, 255, 0.015)",
                }}
              >
                <Box sx={{ px: 2, pt: 2, pb: 1.5 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mb: 1.5,
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 700, color: "#FFFFFF" }}
                    >
                      Chats
                    </Typography>
                    <Box sx={{ display: "flex", gap: 0.5 }}>
                      <IconButton size="small" sx={{ color: COLORS.textSecondary }}>
                        <AddRoundedIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                      <IconButton size="small" sx={{ color: COLORS.textSecondary }}>
                        <MoreVertRoundedIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Search */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      px: 1.5,
                      py: 0.8,
                      borderRadius: "10px",
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.07)",
                      mb: 1.5,
                    }}
                  >
                    <SearchRoundedIcon
                      sx={{ fontSize: 18, color: COLORS.textSecondary }}
                    />
                    <Typography variant="caption" sx={{ color: COLORS.textSecondary }}>
                      Search or start a new chat
                    </Typography>
                  </Box>

                  {/* Filter tabs (real sidebar filters) */}
                  <Stack
                    direction="row"
                    spacing={0.75}
                    sx={{ flexWrap: "wrap", gap: 0.75 }}
                  >
                    {["all", "unread", "favourites", "groups"].map((filter) => (
                      <Chip
                        key={filter}
                        label={filter.charAt(0).toUpperCase() + filter.slice(1)}
                        size="small"
                        onClick={() => setActiveFilter(filter)}
                        sx={{
                          height: 24,
                          fontSize: "0.7rem",
                          fontWeight: 600,
                          color:
                            activeFilter === filter ? "#FFFFFF" : COLORS.textSecondary,
                          backgroundColor:
                            activeFilter === filter
                              ? "rgba(124, 77, 255, 0.25)"
                              : "rgba(255, 255, 255, 0.04)",
                          border:
                            activeFilter === filter
                              ? "1px solid rgba(124, 77, 255, 0.6)"
                              : "1px solid transparent",
                        }}
                      />
                    ))}
                  </Stack>
                </Box>

                <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.06)" }} />

                {/* Conversation list */}
                <Box sx={{ overflow: "hidden", flex: 1 }}>
                  {CONVERSATIONS.map((conv) => {
                    const isActive = activeConv === conv.id;
                    return (
                      <Box
                        key={conv.id}
                        onClick={() => setActiveConv(conv.id)}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          px: 2,
                          py: 1.4,
                          cursor: "pointer",
                          borderLeft: "3px solid",
                          borderColor: isActive ? "#7C4DFF" : "transparent",
                          backgroundColor: isActive
                            ? "rgba(124, 77, 255, 0.14)"
                            : "transparent",
                          transition: "background-color 150ms ease",
                          "&:hover": {
                            backgroundColor: "rgba(255, 255, 255, 0.04)",
                          },
                        }}
                      >
                        <Badge
                          overlap="circular"
                          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                          variant="dot"
                          invisible={!conv.online}
                          sx={{
                            "& .MuiBadge-badge": {
                              backgroundColor: COLORS.success,
                              color: COLORS.success,
                              boxShadow: "0 0 0 2px #0B1224",
                              width: 10,
                              height: 10,
                            },
                          }}
                        >
                          <Avatar
                            sx={{
                              width: 40,
                              height: 40,
                              background: `linear-gradient(135deg, ${conv.color} 0%, rgba(255,255,255,0.15) 100%)`,
                              fontWeight: 700,
                              fontSize: "0.85rem",
                            }}
                          >
                            {conv.name.charAt(0)}
                          </Avatar>
                        </Badge>

                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Typography
                              variant="body2"
                              noWrap
                              sx={{
                                fontWeight: 600,
                                color: "#FFFFFF",
                                fontSize: "0.85rem",
                              }}
                            >
                              {conv.name}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                color:
                                  conv.unread > 0
                                    ? COLORS.secondary
                                    : COLORS.textSecondary,
                                fontSize: "0.68rem",
                              }}
                            >
                              {conv.time}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Typography
                              variant="caption"
                              noWrap
                              sx={{ color: COLORS.textSecondary, fontSize: "0.72rem" }}
                            >
                              {conv.message}
                            </Typography>
                            {conv.unread > 0 && (
                              <Box
                                sx={{
                                  minWidth: 18,
                                  height: 18,
                                  px: 0.6,
                                  borderRadius: "9px",
                                  background: GRADIENTS.brand,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "0.64rem",
                                  fontWeight: 700,
                                  color: "#FFFFFF",
                                }}
                              >
                                {conv.unread}
                              </Box>
                            )}
                          </Box>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>

                {/* Quick actions footer */}
                <Box
                  sx={{
                    display: { xs: "none", md: "flex" },
                    gap: 0.5,
                    px: 1.5,
                    py: 1,
                    borderTop: "1px solid rgba(255, 255, 255, 0.06)",
                  }}
                >
                  {[
                    { label: "New group", icon: <GroupsRoundedIcon sx={{ fontSize: 17 }} /> },
                    { label: "Invite", icon: <PersonAddAltRoundedIcon sx={{ fontSize: 17 }} /> },
                    { label: "Archived", icon: <PushPinRoundedIcon sx={{ fontSize: 17 }} /> },
                    { label: "Wallpaper", icon: <WallpaperRoundedIcon sx={{ fontSize: 17 }} /> },
                  ].map((action) => (
                    <Tooltip key={action.label} title={action.label} arrow>
                      <IconButton
                        size="small"
                        sx={{
                          color: COLORS.textSecondary,
                          "&:hover": { color: "#FFFFFF" },
                        }}
                      >
                        {action.icon}
                      </IconButton>
                    </Tooltip>
                  ))}
                </Box>
              </Box>

              {/* ── Active chat view ── */}
              <Box
                sx={{
                  display: { xs: "none", sm: "flex" },
                  flex: 1,
                  flexDirection: "column",
                  minWidth: 0,
                }}
              >
                {/* Chat header */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: 2.5,
                    py: 1.6,
                    borderBottom: "1px solid rgba(255, 255, 255, 0.07)",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Avatar
                      sx={{
                        width: 38,
                        height: 38,
                        background: `linear-gradient(135deg, ${active.color} 0%, rgba(255,255,255,0.15) 100%)`,
                        fontWeight: 700,
                        fontSize: "0.85rem",
                      }}
                    >
                      {active.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 700, color: "#FFFFFF", fontSize: "0.9rem" }}
                      >
                        {active.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: COLORS.success }}>
                        online
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", gap: 0.5 }}>
                    {[
                      { label: "Voice call", icon: <PhoneRoundedIcon sx={{ fontSize: 18 }} /> },
                      { label: "Video call", icon: <VideocamRoundedIcon sx={{ fontSize: 18 }} /> },
                      { label: "More", icon: <MoreVertRoundedIcon sx={{ fontSize: 18 }} /> },
                    ].map((action) => (
                      <Tooltip key={action.label} title={action.label} arrow>
                        <IconButton
                          size="small"
                          sx={{
                            color: COLORS.textSecondary,
                            "&:hover": { color: "#FFFFFF" },
                          }}
                        >
                          {action.icon}
                        </IconButton>
                      </Tooltip>
                    ))}
                  </Box>
                </Box>
                {/* Message stream */}
                <Box
                  sx={{
                    flex: 1,
                    p: 2.5,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                    backgroundColor: "rgba(255, 255, 255, 0.012)",
                  }}
                >
                  <Box sx={{ alignSelf: "center" }}>
                    <Chip
                      label="Today"
                      size="small"
                      sx={{
                        height: 22,
                        fontSize: "0.66rem",
                        color: COLORS.textSecondary,
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                      }}
                    />
                  </Box>

                  <Box sx={{ alignSelf: "flex-start", maxWidth: "72%" }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 1.4,
                        px: 1.8,
                        borderRadius: "14px 14px 14px 4px",
                        backgroundColor: "rgba(255, 255, 255, 0.07)",
                        color: "#F8FAFC",
                      }}
                    >
                      <Typography variant="body2" sx={{ fontSize: "0.85rem" }}>
                        Hey! Did you check the new dashboard? 👀
                      </Typography>
                    </Paper>
                    <Typography
                      variant="caption"
                      sx={{ color: COLORS.textSecondary, fontSize: "0.66rem", ml: 1 }}
                    >
                      10:42 AM
                    </Typography>
                  </Box>

                  <Box sx={{ alignSelf: "flex-end", maxWidth: "72%" }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 1.4,
                        px: 1.8,
                        borderRadius: "14px 14px 4px 14px",
                        background: GRADIENTS.violet,
                        color: "#FFFFFF",
                        boxShadow: "0 6px 18px rgba(124, 77, 255, 0.35)",
                      }}
                    >
                      <Typography variant="body2" sx={{ fontSize: "0.85rem" }}>
                        Yes — calls, group roles and voice notes all work 🚀
                      </Typography>
                    </Paper>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        gap: 0.5,
                        mr: 1,
                        mt: 0.25,
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{ color: COLORS.textSecondary, fontSize: "0.66rem" }}
                      >
                        10:43 AM
                      </Typography>
                      <DoneAllRoundedIcon
                        sx={{ fontSize: 14, color: COLORS.secondary }}
                      />
                    </Box>
                  </Box>

                  {/* Typing indicator */}
                  <Box sx={{ alignSelf: "flex-start", maxWidth: "72%" }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 1.2,
                        px: 1.8,
                        borderRadius: "14px",
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                        display: "flex",
                        alignItems: "center",
                        gap: 0.6,
                      }}
                    >
                      {[0, 0.2, 0.4].map((delay, i) => (
                        <Box
                          key={i}
                          sx={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            backgroundColor: COLORS.secondary,
                            animation: "chattyTypingDot 1.4s infinite ease-in-out both",
                            animationDelay: `${delay}s`,
                          }}
                        />
                      ))}
                    </Paper>
                  </Box>
                </Box>

                {/* Composer */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    px: 2,
                    py: 1.5,
                    borderTop: "1px solid rgba(255, 255, 255, 0.07)",
                  }}
                >
                  <IconButton size="small" sx={{ color: COLORS.textSecondary }}>
                    <SentimentSatisfiedRoundedIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                  <IconButton size="small" sx={{ color: COLORS.textSecondary }}>
                    <AttachFileRoundedIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                  <Box
                    sx={{
                      flex: 1,
                      px: 1.5,
                      py: 0.9,
                      borderRadius: "10px",
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.07)",
                    }}
                  >
                    <Typography variant="caption" sx={{ color: COLORS.textSecondary }}>
                      Type a message…
                    </Typography>
                  </Box>
                  <Tooltip title="Voice note" arrow>
                    <IconButton size="small" sx={{ color: COLORS.textSecondary }}>
                      <MicRoundedIcon sx={{ fontSize: 20 }} />
                    </IconButton>
                  </Tooltip>
                  <IconButton
                    size="small"
                    sx={{
                      background: GRADIENTS.brand,
                      color: "#FFFFFF",
                      "&:hover": { background: GRADIENTS.brandReverse },
                    }}
                  >
                    <SendRoundedIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          </Paper>
        </motion.div>
        {/* ── Capability tiles ── */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(3, 1fr)" },
            gap: 2.5,
            mt: 7,
          }}
        >
          {CAPABILITIES.map((cap, index) => (
            <motion.div
              key={cap.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: index * 0.06 }}
            >
              <Paper
                elevation={0}
                sx={{
                  height: "100%",
                  p: 3,
                  borderRadius: "16px",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  backgroundColor: "rgba(255, 255, 255, 0.025)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    borderColor: "rgba(124, 77, 255, 0.45)",
                    backgroundColor: "rgba(255, 255, 255, 0.045)",
                    boxShadow: "0 18px 40px rgba(2, 6, 23, 0.55)",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 46,
                    height: 46,
                    borderRadius: "13px",
                    background: cap.gradient,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#FFFFFF",
                    mb: 2,
                    boxShadow: "0 8px 20px rgba(124, 77, 255, 0.3)",
                  }}
                >
                  {React.cloneElement(cap.icon as React.ReactElement, {
                    sx: { fontSize: 22 },
                  })}
                </Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, color: "#FFFFFF", mb: 1, fontSize: "1.05rem" }}
                >
                  {cap.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: COLORS.textSecondary,
                    lineHeight: 1.7,
                    fontSize: "0.88rem",
                  }}
                >
                  {cap.description}
                </Typography>
              </Paper>
            </motion.div>
          ))}
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate(isAuthenticated ? "/chat" : "/SignUp")}
            startIcon={<ChatBubbleRoundedIcon />}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: "1rem",
              fontWeight: 700,
              borderRadius: "12px",
              textTransform: "none",
              background: GRADIENTS.brand,
              boxShadow: "0 8px 26px rgba(124, 77, 255, 0.4)",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 12px 32px rgba(0, 229, 255, 0.45)",
              },
            }}
          >
            {isAuthenticated ? "Open the dashboard" : "Create free account"}
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default DashboardShowcase;