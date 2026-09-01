/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, CssBaseline, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { RootState } from "../../redux/store";
import { connectSocket, disconnectSocket } from "../../utils/socketService";
import { checkAuthRes } from "../../utils/checkAuth";
import { getUsersForSidebar, getGroupsAPI } from "../../services/message";
import { toStartCaseStr } from "../../utils/common";
import { SET_ALL_USERS } from "../../redux/features/auth/authSlice";
import { hydrateUserSettings } from "../../utils/userSettings";
import { TUser } from "../../types";

import LeftNavigation from "../../components/navigation/LeftNavigation";
import ChatsSidebar from "../../components/sidebars/ChatsSidebar";
import ContactsSidebar from "../../components/sidebars/ContactsSidebar";
import GroupsSidebar from "../../components/sidebars/GroupsSidebar";
import ProfileSidebar from "../../components/sidebars/ProfileSidebar";
import SettingsSidebar from "../../components/sidebars/SettingsSidebar";
import CallsSidebar from "../../components/sidebars/CallsSidebar";

import EmptyStateView from "../../components/chat/EmptyStateView";
import ActiveChatView from "../../components/chat/ActiveChatView";
import ChatWallpaperDrawer from "../../components/wallpaper/ChatWallpaperDrawer";

import ContactDetailModal from "../../components/modals/ContactDetailModal";
import NewGroupModal from "../../components/modals/NewGroupModal";
import QRCodeModal from "../../components/modals/QRCodeModal";
import EditProfileModal from "../../components/modals/EditProfileModal";
import DisappearingMessagesModal from "../../components/modals/DisappearingMessagesModal";
import NewChatModal from "../../components/modals/NewChatModal";
import ArchivedChatsModal from "../../components/modals/ArchivedChatsModal";
import InviteFriendModal from "../../components/modals/InviteFriendModal";
import Loader from "../../components/loader";

export default function ChatContainer() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [isLoading, setIsLoading] = useState(false);

  const { loginUser } = useSelector((state: RootState) => state.auth);
  const { receiverId } = useSelector((state: RootState) => state.message);
  const { activeNavTab } = useSelector((state: RootState) => state.settings);

  const myId = loginUser?.id;

  // Initialize socket and fetch user list
  useEffect(() => {
    if (!loginUser?.id) {
      checkAuthRes(dispatch, setIsLoading);
    } else {
      hydrateUserSettings(dispatch, loginUser);
      connectSocket(String(loginUser.id), dispatch);
      fetchInitialUsers();

      return () => {
        disconnectSocket();
      };
    }
  }, [loginUser?.id]);

  const fetchInitialUsers = async () => {
    try {
      const params = { id: myId };
      const [usersResponse, groupsResponse] = await Promise.all([
        getUsersForSidebar(params),
        getGroupsAPI(),
      ]);

      if (usersResponse?.success) {
        const users = (usersResponse?.data || []).map((d: TUser) => ({
          ...d,
          id: String(d.id),
          img: d?.img || "",
          name: toStartCaseStr(d?.name),
          unreadCount: d?.unreadCount ?? 0,
          isFavourite: !!d?.isFavourite,
        }));
        const groups = (groupsResponse?.success ? groupsResponse.data : []).map(
          (group: TUser) => ({
            ...group,
            id: String(group.id),
            name: group.name,
            isGroup: true,
            img: "",
          })
        );
        const conversation = [...users, ...groups];
        if (conversation.length > 0) {
          dispatch(SET_ALL_USERS(conversation));
        }
      }
    } catch (error) {
      console.error("Failed to fetch sidebar users:", error);
    }
  };

  // Render Left Panel based on selected Navigation Tab
  const renderSidebar = () => {
    switch (activeNavTab) {
      case "contacts":
        return <ContactsSidebar />;
      case "groups":
        return <GroupsSidebar />;
      case "calls":
        return <CallsSidebar />;
      case "profile":
        return <ProfileSidebar />;
      case "settings":
        return <SettingsSidebar />;
      case "chats":
      default:
        return <ChatsSidebar />;
    }
  };

  // On mobile: show chat if receiverId is set and on chats tab; otherwise show sidebar
  const showMobileChat = isMobile && !!receiverId && activeNavTab === "chats";
  const showSidebar = !isMobile || !showMobileChat;

  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column-reverse", md: "row" },
          height: "100dvh",
          width: "100vw",
          overflow: "hidden",
          backgroundColor: theme.palette.background.default,
        }}
      >
        {/* ── Far-Left Navigation Rail ── */}
        {(!isMobile || !showMobileChat) && <LeftNavigation />}

        {/* ── Left Sidebar Panel (Chats / Contacts / Groups / Profile / Settings) ── */}
        {showSidebar && (
          <Box
            sx={{
              width: { xs: "100%", md: 340, lg: 360 },
              height: { xs: "calc(100dvh - 58px)", md: "100%" },
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              borderRight: { xs: "none", md: `1px solid ${theme.palette.divider}` },
              overflow: "hidden",
            }}
          >
            {renderSidebar()}
          </Box>
        )}

        {/* ── Center Main Content Column (Active Chat or Empty State) ── */}
        {(!isMobile || showMobileChat) && (
          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              position: "relative",
            }}
          >
            {activeNavTab === "chats" && receiverId ? (
              <ActiveChatView />
            ) : (
              <EmptyStateView tab={activeNavTab} />
            )}
          </Box>
        )}

        {/* ── Right-Side Dedicated Wallpaper Drawer (Pages 10 & 11) ── */}
        <ChatWallpaperDrawer />
      </Box>

      {/* ── All Modals Matching PDF ── */}
      <ContactDetailModal />
      <NewGroupModal />
      <QRCodeModal />
      <EditProfileModal />
      <DisappearingMessagesModal />
      <NewChatModal />
      <ArchivedChatsModal />
      <InviteFriendModal />

      <Loader loading={isLoading} title="Loading Application..." />
    </>
  );
}