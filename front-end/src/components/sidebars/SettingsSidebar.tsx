import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Avatar,
  Divider,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import QrCodeRoundedIcon from "@mui/icons-material/QrCodeRounded";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";
import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";
import StorageRoundedIcon from "@mui/icons-material/StorageRounded";
import DevicesRoundedIcon from "@mui/icons-material/DevicesRounded";

import { RootState } from "../../redux/store";
import {
  SET_SETTINGS_SECTION,
  SET_QR_CODE_MODAL_OPEN,
  SET_ACTIVE_NAV_TAB,
} from "../../redux/features/settings/settingsSlice";
import { PURPLE_PRIMARY } from "../../theme";
import AppearanceSidebar from "./AppearanceSidebar";

export const SettingsSidebar: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const { settingsSection, theme: currentTheme, profileUserData } = useSelector(
    (state: RootState) => state.settings
  );
  const { loginUser } = useSelector((state: RootState) => state.auth);

  const [searchQuery, setSearchQuery] = useState("");

  const displayName = loginUser?.name || profileUserData.name;
  const userAvatar = loginUser?.img || profileUserData.avatar;
  const username = profileUserData.username;

  // If in Appearance subview, render AppearanceSidebar
  if (settingsSection === "appearance") {
    return <AppearanceSidebar onBack={() => dispatch(SET_SETTINGS_SECTION("main"))} />;
  }

  const accountItems = [
    {
      id: "account",
      title: "Account",
      subtitle: "Profile info and social l...",
      value: profileUserData.name || "Your account",
      icon: PersonOutlineRoundedIcon,
      onClick: () => dispatch(SET_ACTIVE_NAV_TAB("profile")),
    },
    {
      id: "qr",
      title: "QR Code",
      subtitle: "Share your code or scan one",
      icon: QrCodeRoundedIcon,
      onClick: () => dispatch(SET_QR_CODE_MODAL_OPEN({ open: true, tab: "my-code" })),
    },
    {
      id: "privacy",
      title: "Privacy",
      subtitle: "Who can see your activity",
      value: "Everyone",
      icon: LockOutlinedIcon,
      onClick: () => {},
    },
    {
      id: "security",
      title: "Security",
      subtitle: "Password and screen lock",
      icon: SecurityOutlinedIcon,
      onClick: () => {},
    },
  ];

  const preferencesItems = [
    {
      id: "notifications",
      title: "Notifications",
      subtitle: "Message and call alerts",
      value: "On",
      icon: NotificationsNoneRoundedIcon,
      onClick: () => {},
    },
    {
      id: "chats",
      title: "Chats",
      subtitle: "History, media and backup",
      icon: ChatBubbleOutlineRoundedIcon,
      onClick: () => dispatch(SET_ACTIVE_NAV_TAB("chats")),
    },
    {
      id: "appearance",
      title: "Appearance",
      subtitle: "Theme, font size and wallpaper",
      value: currentTheme === "dark" ? "Dark" : "Light",
      icon: PaletteOutlinedIcon,
      onClick: () => dispatch(SET_SETTINGS_SECTION("appearance")),
    },
    {
      id: "language",
      title: "Language",
      subtitle: "App language and region",
      value: "English",
      icon: LanguageRoundedIcon,
      onClick: () => {},
    },
  ];

  const systemItems = [
    {
      id: "storage",
      title: "Storage",
      subtitle: "Usage and auto download",
      value: "1.6 GB",
      icon: StorageRoundedIcon,
      onClick: () => {},
    },
    {
      id: "devices",
      title: "Devices",
      subtitle: "Linked devices and sessions",
      value: "3 linked",
      icon: DevicesRoundedIcon,
      onClick: () => {},
    },
  ];

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
      <Box sx={{ px: 2.5, py: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.15rem", color: theme.palette.text.primary }}>
          Settings
        </Typography>
      </Box>

      {/* ── Search Settings ── */}
      <Box sx={{ px: 2.5, pb: 1.5 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search Settings"
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

      {/* ── Scrollable Settings List ── */}
      <Box sx={{ flex: 1, overflowY: "auto", px: 2.5, pb: 3 }}>
        {/* User Card */}
        <Box
          onClick={() => dispatch(SET_ACTIVE_NAV_TAB("profile"))}
          sx={{
            cursor: "pointer",
            p: 1.5,
            borderRadius: "12px",
            backgroundColor: theme.palette.mode === "dark" ? alpha("#FFFFFF", 0.02) : "#FFFFFF",
            border: `1px solid ${theme.palette.divider}`,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            mb: 2.5,
            transition: "all 150ms ease",
            "&:hover": {
              borderColor: PURPLE_PRIMARY,
              backgroundColor: theme.palette.mode === "dark" ? alpha("#FFFFFF", 0.05) : "#FFFFFF",
            },
          }}
        >
          <Avatar
            src={userAvatar}
            alt={displayName}
            sx={{
              width: 46,
              height: 46,
              fontSize: "1rem",
              fontWeight: 700,
              backgroundColor: alpha(PURPLE_PRIMARY, 0.15),
              color: PURPLE_PRIMARY,
            }}
          >
            {displayName?.[0]?.toUpperCase()}
          </Avatar>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography noWrap variant="subtitle2" sx={{ fontWeight: 700, fontSize: "0.9rem" }}>
              {displayName}
            </Typography>
            <Typography noWrap variant="caption" sx={{ color: theme.palette.text.secondary }}>
              {username}
            </Typography>
          </Box>

          <ChevronRightRoundedIcon sx={{ color: theme.palette.text.secondary, fontSize: 20 }} />
        </Box>

        {/* Section: ACCOUNT */}
        <Typography
          variant="caption"
          sx={{
            fontWeight: 700,
            fontSize: "0.7rem",
            color: theme.palette.text.secondary,
            letterSpacing: "0.05em",
            display: "block",
            mb: 1,
            px: 0.5,
          }}
        >
          ACCOUNT
        </Typography>

        <Box
          sx={{
            backgroundColor: theme.palette.mode === "dark" ? alpha("#FFFFFF", 0.02) : "#FFFFFF",
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: "12px",
            mb: 2.5,
            overflow: "hidden",
          }}
        >
          {accountItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <React.Fragment key={item.id}>
                <Box
                  onClick={item.onClick}
                  sx={{
                    px: 1.5,
                    py: 1.25,
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    cursor: "pointer",
                    transition: "background-color 150ms ease",
                    "&:hover": {
                      backgroundColor: theme.palette.mode === "dark" ? alpha("#FFFFFF", 0.04) : alpha(PURPLE_PRIMARY, 0.04),
                    },
                  }}
                >
                  <Icon sx={{ color: theme.palette.text.secondary, fontSize: 19 }} />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: "0.825rem" }}>
                      {item.title}
                    </Typography>
                    <Typography noWrap variant="caption" sx={{ color: theme.palette.text.secondary, display: "block" }}>
                      {item.subtitle}
                    </Typography>
                  </Box>

                  {item.value && (
                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontSize: "0.75rem", mr: 0.5 }}>
                      {item.value}
                    </Typography>
                  )}

                  <ChevronRightRoundedIcon sx={{ color: theme.palette.text.secondary, fontSize: 18 }} />
                </Box>
                {idx < accountItems.length - 1 && <Divider sx={{ borderColor: theme.palette.divider }} />}
              </React.Fragment>
            );
          })}
        </Box>

        {/* Section: PREFERENCES */}
        <Typography
          variant="caption"
          sx={{
            fontWeight: 700,
            fontSize: "0.7rem",
            color: theme.palette.text.secondary,
            letterSpacing: "0.05em",
            display: "block",
            mb: 1,
            px: 0.5,
          }}
        >
          PREFERENCES
        </Typography>

        <Box
          sx={{
            backgroundColor: theme.palette.mode === "dark" ? alpha("#FFFFFF", 0.02) : "#FFFFFF",
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: "12px",
            mb: 2.5,
            overflow: "hidden",
          }}
        >
          {preferencesItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <React.Fragment key={item.id}>
                <Box
                  onClick={item.onClick}
                  sx={{
                    px: 1.5,
                    py: 1.25,
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    cursor: "pointer",
                    transition: "background-color 150ms ease",
                    "&:hover": {
                      backgroundColor: theme.palette.mode === "dark" ? alpha("#FFFFFF", 0.04) : alpha(PURPLE_PRIMARY, 0.04),
                    },
                  }}
                >
                  <Icon sx={{ color: theme.palette.text.secondary, fontSize: 19 }} />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: "0.825rem" }}>
                      {item.title}
                    </Typography>
                    <Typography noWrap variant="caption" sx={{ color: theme.palette.text.secondary, display: "block" }}>
                      {item.subtitle}
                    </Typography>
                  </Box>

                  {item.value && (
                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontSize: "0.75rem", mr: 0.5 }}>
                      {item.value}
                    </Typography>
                  )}

                  <ChevronRightRoundedIcon sx={{ color: theme.palette.text.secondary, fontSize: 18 }} />
                </Box>
                {idx < preferencesItems.length - 1 && <Divider sx={{ borderColor: theme.palette.divider }} />}
              </React.Fragment>
            );
          })}
        </Box>

        {/* Section: SYSTEM */}
        <Typography
          variant="caption"
          sx={{
            fontWeight: 700,
            fontSize: "0.7rem",
            color: theme.palette.text.secondary,
            letterSpacing: "0.05em",
            display: "block",
            mb: 1,
            px: 0.5,
          }}
        >
          SYSTEM
        </Typography>

        <Box
          sx={{
            backgroundColor: theme.palette.mode === "dark" ? alpha("#FFFFFF", 0.02) : "#FFFFFF",
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          {systemItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <React.Fragment key={item.id}>
                <Box
                  onClick={item.onClick}
                  sx={{
                    px: 1.5,
                    py: 1.25,
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    cursor: "pointer",
                    transition: "background-color 150ms ease",
                    "&:hover": {
                      backgroundColor: theme.palette.mode === "dark" ? alpha("#FFFFFF", 0.04) : alpha(PURPLE_PRIMARY, 0.04),
                    },
                  }}
                >
                  <Icon sx={{ color: theme.palette.text.secondary, fontSize: 19 }} />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: "0.825rem" }}>
                      {item.title}
                    </Typography>
                    <Typography noWrap variant="caption" sx={{ color: theme.palette.text.secondary, display: "block" }}>
                      {item.subtitle}
                    </Typography>
                  </Box>

                  {item.value && (
                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontSize: "0.75rem", mr: 0.5 }}>
                      {item.value}
                    </Typography>
                  )}

                  <ChevronRightRoundedIcon sx={{ color: theme.palette.text.secondary, fontSize: 18 }} />
                </Box>
                {idx < systemItems.length - 1 && <Divider sx={{ borderColor: theme.palette.divider }} />}
              </React.Fragment>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default SettingsSidebar;
