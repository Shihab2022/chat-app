import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, Button, Stack } from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import GroupAddRoundedIcon from "@mui/icons-material/GroupAddRounded";
import ArchiveRoundedIcon from "@mui/icons-material/ArchiveRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";

import { RootState } from "../../redux/store";
import {
  SET_ACTIVE_NAV_TAB,
  SET_NEW_GROUP_MODAL_OPEN,
  SET_NEW_CHAT_MODAL_OPEN,
  SET_ARCHIVED_CHATS_OPEN,
  SET_INVITE_FRIEND_MODAL_OPEN,
  SET_SETTINGS_SECTION,
} from "../../redux/features/settings/settingsSlice";
import { PURPLE_PRIMARY } from "../../theme";
import { TUser } from "../../types";

interface Props {
  tab?: string;
}

export const EmptyStateView: React.FC<Props> = ({ tab }) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const { activeNavTab, wallpaperStyle, settingsSection } = useSelector(
    (state: RootState) => state.settings
  );
  const { allUsers = [], activeUsers = [] } = useSelector((state: RootState) => state.auth);

  const currentTab = tab || activeNavTab;

  // Real stats calculation
  const totalContacts = (allUsers || []).filter((u: TUser) => !u.isGroup).length;
  const onlineContacts = (activeUsers || []).length;
  const favouriteContacts = (allUsers || []).filter((u: TUser) => !u.isGroup && u.isFavourite).length;

  const totalGroups = (allUsers || []).filter((u: TUser) => !!u.isGroup).length;
  const unreadGroups = 0;
  const mutedGroups = 0;

  // Render based on current active tab matching PDF Page 1, 3, 5, 8, 9
  const renderContent = () => {
    switch (currentTab) {
      case "contacts":
        return {
          icon: <PeopleAltOutlinedIcon sx={{ fontSize: 32, color: theme.palette.text.secondary }} />,
          title: "All Contacts",
          subtitle: "Pick someone on the left to open your conversation.",
          stats: [
            { label: "Contacts", count: totalContacts },
            { label: "Online", count: onlineContacts },
            { label: "Favourites", count: favouriteContacts },
          ],
          buttons: [
            {
              label: "All Contacts",
              variant: "contained" as const,
              onClick: () => {},
            },
            {
              label: "Online",
              variant: "outlined" as const,
              onClick: () => {},
            },
            {
              label: "Invite Others",
              variant: "outlined" as const,
              icon: <SendRoundedIcon sx={{ fontSize: 14 }} />,
              onClick: () => dispatch(SET_INVITE_FRIEND_MODAL_OPEN(true)),
            },
          ],
        };

      case "groups":
        return {
          icon: <GroupsOutlinedIcon sx={{ fontSize: 32, color: theme.palette.text.secondary }} />,
          title: "All Groups",
          subtitle: "Pick a group on the left to open its conversation.",
          stats: [
            { label: "Groups", count: totalGroups },
            { label: "Unread", count: unreadGroups },
            { label: "Muted", count: mutedGroups },
          ],
          buttons: [
            {
              label: "New Group",
              variant: "contained" as const,
              icon: <AddRoundedIcon sx={{ fontSize: 16 }} />,
              onClick: () => dispatch(SET_NEW_GROUP_MODAL_OPEN(true)),
            },
            {
              label: "All Groups",
              variant: "outlined" as const,
              onClick: () => {},
            },
            {
              label: "Unread",
              variant: "outlined" as const,
              onClick: () => {},
            },
          ],
        };

      case "settings":
        if (settingsSection === "appearance") {
          return {
            icon: <SettingsOutlinedIcon sx={{ fontSize: 32, color: theme.palette.text.secondary }} />,
            title: "Appearance",
            subtitle: "Theme, font size and layout density.",
            buttons: [
              {
                label: "Account",
                variant: "contained" as const,
                icon: <PeopleAltOutlinedIcon sx={{ fontSize: 14 }} />,
                onClick: () => dispatch(SET_ACTIVE_NAV_TAB("profile")),
              },
              {
                label: "Privacy",
                variant: "outlined" as const,
                icon: <LockOutlinedIcon sx={{ fontSize: 14 }} />,
                onClick: () => {},
              },
              {
                label: "Appearance",
                variant: "outlined" as const,
                icon: <PaletteOutlinedIcon sx={{ fontSize: 14 }} />,
                onClick: () => dispatch(SET_SETTINGS_SECTION("appearance")),
              },
            ],
          };
        }
        return {
          icon: <SettingsOutlinedIcon sx={{ fontSize: 32, color: theme.palette.text.secondary }} />,
          title: "Settings",
          subtitle: "Pick a section on the left to manage your account.",
          buttons: [
            {
              label: "Account",
              variant: "contained" as const,
              icon: <PeopleAltOutlinedIcon sx={{ fontSize: 14 }} />,
              onClick: () => dispatch(SET_ACTIVE_NAV_TAB("profile")),
            },
            {
              label: "Privacy",
              variant: "outlined" as const,
              icon: <LockOutlinedIcon sx={{ fontSize: 14 }} />,
              onClick: () => {},
            },
            {
              label: "Appearance",
              variant: "outlined" as const,
              icon: <PaletteOutlinedIcon sx={{ fontSize: 14 }} />,
              onClick: () => dispatch(SET_SETTINGS_SECTION("appearance")),
            },
          ],
        };

      case "chats":
      default:
        return {
          icon: <ChatBubbleOutlineRoundedIcon sx={{ fontSize: 32, color: theme.palette.text.secondary }} />,
          title: "Select a conversation",
          subtitle: "Choose a contact from the left to start chatting.",
          buttons: [
            {
              label: "New Chat",
              variant: "contained" as const,
              icon: <AddRoundedIcon sx={{ fontSize: 16 }} />,
              onClick: () => dispatch(SET_NEW_CHAT_MODAL_OPEN(true)),
            },
            {
              label: "New Group",
              variant: "outlined" as const,
              icon: <GroupAddRoundedIcon sx={{ fontSize: 16 }} />,
              onClick: () => dispatch(SET_NEW_GROUP_MODAL_OPEN(true)),
            },
            {
              label: "Archived Chats",
              variant: "outlined" as const,
              icon: <ArchiveRoundedIcon sx={{ fontSize: 16 }} />,
              onClick: () => dispatch(SET_ARCHIVED_CHATS_OPEN(true)),
            },
          ],
        };
    }
  };

  const content = renderContent();

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
        textAlign: "center",
        ...wallpaperStyle,
      }}
    >
      {/* Light Circular Icon Container matching PDF */}
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          backgroundColor: theme.palette.mode === "dark" ? alpha("#FFFFFF", 0.05) : "#F3F4F6",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 2.5,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        {content.icon}
      </Box>

      {/* Title */}
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          fontSize: "1.2rem",
          color: theme.palette.text.primary,
          mb: 0.75,
        }}
      >
        {content.title}
      </Typography>

      {/* Subtitle */}
      <Typography
        variant="body2"
        sx={{
          color: theme.palette.text.secondary,
          fontSize: "0.85rem",
          mb: content.stats ? 2.5 : 3,
          maxWidth: 380,
        }}
      >
        {content.subtitle}
      </Typography>

      {/* Optional Statistics Row (Pages 3 & 5) */}
      {content.stats && (
        <Stack
          direction="row"
          spacing={4}
          sx={{
            mb: 3,
            px: 3,
            py: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {content.stats.map((st) => (
            <Box key={st.label} sx={{ textAlign: "center" }}>
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.15rem", color: theme.palette.text.primary, lineHeight: 1.1 }}>
                {st.count}
              </Typography>
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontSize: "0.75rem" }}>
                {st.label}
              </Typography>
            </Box>
          ))}
        </Stack>
      )}

      {/* Action Buttons Row */}
      <Stack direction="row" spacing={1.5} sx={{ flexWrap: "wrap", justifyContent: "center", gap: 1 }}>
        {content.buttons.map((btn) => (
          <Button
            key={btn.label}
            variant={btn.variant}
            onClick={btn.onClick}
            startIcon={btn.icon}
            sx={{
              borderRadius: "8px",
              py: 0.85,
              px: 2,
              fontSize: "0.8125rem",
              fontWeight: 600,
              backgroundColor: btn.variant === "contained" ? PURPLE_PRIMARY : theme.palette.mode === "dark" ? alpha("#FFFFFF", 0.05) : "#FFFFFF",
              color: btn.variant === "contained" ? "#FFFFFF" : PURPLE_PRIMARY,
              borderColor: PURPLE_PRIMARY,
              boxShadow: btn.variant === "contained" ? `0 2px 8px ${alpha(PURPLE_PRIMARY, 0.25)}` : "none",
              "&:hover": {
                backgroundColor: btn.variant === "contained" ? "#6D28D9" : alpha(PURPLE_PRIMARY, 0.08),
                borderColor: "#6D28D9",
              },
            }}
          >
            {btn.label}
          </Button>
        ))}
      </Stack>
    </Box>
  );
};

export default EmptyStateView;
