import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, IconButton, Tooltip, Avatar, Badge, Stack } from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import ChatBubbleRoundedIcon from "@mui/icons-material/ChatBubbleRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import DonutLargeRoundedIcon from "@mui/icons-material/DonutLargeRounded";
import CallRoundedIcon from "@mui/icons-material/CallRounded";
import AlternateEmailRoundedIcon from "@mui/icons-material/AlternateEmailRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";

import { RootState } from "../../redux/store";
import {
  SET_ACTIVE_NAV_TAB,
  SET_SETTINGS_SECTION,
  SET_THEME,
  NavTab,
} from "../../redux/features/settings/settingsSlice";
import { PURPLE_PRIMARY, STATUS_ONLINE } from "../../theme";
import { persistUserSettings } from "../../utils/userSettings";
import { CALL_ENABLED } from "../../constants/call";

export const LeftNavigation: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { activeNavTab, theme: currentTheme, profileUserData } = useSelector(
    (state: RootState) => state.settings
  );
  const { loginUser } = useSelector((state: RootState) => state.auth);

  const isDark = currentTheme === "dark";

  const handleNavClick = (tab: NavTab) => {
    dispatch(SET_ACTIVE_NAV_TAB(tab));
    if (tab === "settings") {
      dispatch(SET_SETTINGS_SECTION("main"));
    }
  };

  const handleThemeToggle = () => {
    const nextTheme = isDark ? "light" : "dark";
    dispatch(SET_THEME(nextTheme));
    void persistUserSettings({ theme: nextTheme });
  };

  const navItems = [
    { id: "chats" as NavTab, label: "Chats", icon: ChatBubbleRoundedIcon },
    { id: "contacts" as NavTab, label: "Contacts", icon: PeopleAltRoundedIcon },
    { id: "groups" as NavTab, label: "Groups", icon: GroupsRoundedIcon },
    { id: "status" as NavTab, label: "Status", icon: DonutLargeRoundedIcon },
    ...(CALL_ENABLED
      ? [{ id: "calls" as NavTab, label: "Calls", icon: CallRoundedIcon }]
      : []),
    { id: "saved" as NavTab, label: "Mentions & Saved", icon: AlternateEmailRoundedIcon },
    { id: "settings" as NavTab, label: "Settings", icon: SettingsRoundedIcon },
  ];

  const userDisplayName = loginUser?.name || profileUserData.name;
  const userAvatarImg = loginUser?.img || profileUserData.avatar;

  return (
    <Box
      component="nav"
      aria-label="Application Navigation"
      sx={{
        width: { xs: "100%", md: 64 },
        height: { xs: "auto", md: "100vh" },
        backgroundColor: isDark ? theme.palette.background.paper : "#FFFFFF",
        borderRight: { xs: "none", md: `1px solid ${theme.palette.divider}` },
        borderTop: { xs: `1px solid ${theme.palette.divider}`, md: "none" },
        display: "flex",
        flexDirection: { xs: "row", md: "column" },
        alignItems: "center",
        justifyContent: "space-between",
        py: { xs: 0.75, md: 2 },
        px: { xs: 1.5, md: 1 },
        zIndex: theme.zIndex.drawer + 2,
        flexShrink: 0,
      }}
    >
      {/* Top Logo */}
      <Box sx={{ display: { xs: "none", md: "flex" }, flexDirection: "column", alignItems: "center", mb: 2 }}>
        <Box
          onClick={() => handleNavClick("chats")}
          sx={{
            width: 40,
            height: 40,
            borderRadius: "12px",
            background: `linear-gradient(135deg, ${PURPLE_PRIMARY} 0%, #3B82F6 100%)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#FFFFFF",
            cursor: "pointer",
            boxShadow: `0 4px 12px ${alpha(PURPLE_PRIMARY, 0.35)}`,
            transition: "transform 150ms ease",
            "&:hover": { transform: "scale(1.05)" },
          }}
        >
          {/* Infinity / Chat mark SVG */}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 2C6.477 2 2 6.142 2 11.25C2 14.156 3.42 16.745 5.672 18.428L4.654 21.482C4.545 21.808 4.882 22.098 5.185 21.942L8.85 20.053C9.843 20.347 10.898 20.5 12 20.5C17.523 20.5 22 16.358 22 11.25C22 6.142 17.523 2 12 2Z"
              fill="white"
            />
            <circle cx="8" cy="11" r="1.5" fill={PURPLE_PRIMARY} />
            <circle cx="12" cy="11" r="1.5" fill={PURPLE_PRIMARY} />
            <circle cx="16" cy="11" r="1.5" fill={PURPLE_PRIMARY} />
          </svg>
        </Box>
      </Box>

      {/* Center Navigation Icons */}
      <Stack
        direction={{ xs: "row", md: "column" }}
        spacing={{ xs: 1, md: 1.5 }}
        sx={{
          alignItems: "center",
          justifyContent: { xs: "space-around", md: "flex-start" },
          width: "100%",
          flex: 1,
        }}
      >
        {navItems.map((item) => {
          const isActive = activeNavTab === item.id;
          const Icon = item.icon;

          return (
            <Tooltip key={item.id} title={item.label} placement="right" arrow>
              <IconButton
                onClick={() => handleNavClick(item.id)}
                aria-label={item.label}
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: "12px",
                  backgroundColor: isActive ? PURPLE_PRIMARY : "transparent",
                  color: isActive
                    ? "#FFFFFF"
                    : isDark
                    ? theme.palette.text.secondary
                    : "#6B7280",
                  transition: "all 150ms ease",
                  "&:hover": {
                    backgroundColor: isActive
                      ? PURPLE_PRIMARY
                      : isDark
                      ? alpha("#FFFFFF", 0.08)
                      : alpha(PURPLE_PRIMARY, 0.08),
                    color: isActive ? "#FFFFFF" : PURPLE_PRIMARY,
                  },
                }}
              >
                <Icon sx={{ fontSize: 22 }} />
              </IconButton>
            </Tooltip>
          );
        })}
      </Stack>

      {/* Bottom Area: Theme Switcher & User Avatar */}
      <Stack
        direction={{ xs: "row", md: "column" }}
        spacing={1.5}
        sx={{ alignItems: "center", mt: "auto" }}
      >
        {/* Theme Toggle Button */}
        <Tooltip title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"} placement="right" arrow>
          <IconButton
            onClick={handleThemeToggle}
            aria-label="toggle theme"
            sx={{
              width: 40,
              height: 40,
              borderRadius: "12px",
              color: isDark ? "#FBBF24" : "#6B7280",
              "&:hover": {
                backgroundColor: isDark ? alpha("#FFFFFF", 0.08) : alpha(PURPLE_PRIMARY, 0.08),
              },
            }}
          >
            {isDark ? <LightModeOutlinedIcon sx={{ fontSize: 20 }} /> : <DarkModeOutlinedIcon sx={{ fontSize: 20 }} />}
          </IconButton>
        </Tooltip>

        {/* User Avatar with Online Dot */}
        <Tooltip title="View Profile" placement="right" arrow>
          <Box
            onClick={() => handleNavClick("profile")}
            sx={{ cursor: "pointer", position: "relative", display: "inline-flex" }}
          >
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
              sx={{
                "& .MuiBadge-badge": {
                  backgroundColor: STATUS_ONLINE,
                  color: STATUS_ONLINE,
                  boxShadow: `0 0 0 2px ${isDark ? theme.palette.background.paper : "#FFFFFF"}`,
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                },
              }}
            >
              <Avatar
                src={userAvatarImg}
                alt={userDisplayName}
                sx={{
                  width: 38,
                  height: 38,
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  backgroundColor: alpha(PURPLE_PRIMARY, 0.15),
                  color: PURPLE_PRIMARY,
                  border: activeNavTab === "profile" ? `2px solid ${PURPLE_PRIMARY}` : "none",
                  transition: "transform 150ms ease",
                  "&:hover": { transform: "scale(1.06)" },
                }}
              >
                {userDisplayName ? userDisplayName[0].toUpperCase() : "S"}
              </Avatar>
            </Badge>
          </Box>
        </Tooltip>
      </Stack>
    </Box>
  );
};

export default LeftNavigation;
