/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Box, CssBaseline, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import LeftSiteBar from "./leftSiteBar";
import { RightSidebar } from "./rightSiteBar";
import ChatHeader from "./navBar";
import Message from "../../components/messages/message";
import SearchField from "../../components/searchField";
import Loader from "../../components/loader";
import EmptyState from "../../components/ui/EmptyState";
import { getGroupsAPI, getUsersForSidebar } from "../../services/message";
import { toStartCaseStr } from "../../utils/common";
import { checkAuthRes } from "../../utils/checkAuth";
import {
  SET_RECEIVER_ID,
  SET_RIGHT_SIDEBAR_OPEN_STATUS,
} from "../../redux/features/chat/conversationSlice";
import { SET_ALL_USERS as SET_USERS } from "../../redux/features/auth/authSlice";
import { RootState } from "../../redux/store";
import { TUser } from "../../types";
import { showToast } from "../../utils/toast";
import {
  CONFIRM_MESSAGE,
  DRAWER_WIDTH,
  WARNING,
} from "../../constants/common";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";

const LEFT_DRAWER_WIDTH = DRAWER_WIDTH; // 340
const RIGHT_DRAWER_WIDTH = "368px";

function ChatContainer() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [isLoading, setIsLoading] = useState(false);
  const [mobileChatOpen, setMobileChatOpen] = useState(false);

  const { loginUser } = useSelector((state: RootState) => state?.auth);
  const { isRightSidebarOpen, receiverId } = useSelector((state: RootState) => state?.message);
  const { id: myId } = loginUser || {};

  const handleDrawerToggle = () => setMobileChatOpen(!mobileChatOpen);
  void handleDrawerToggle;

  const handleRightSidebarToggle = () => {
    dispatch(SET_RIGHT_SIDEBAR_OPEN_STATUS(!isRightSidebarOpen));
  };

  const getAllUsers = async () => {
    try {
      const params = { id: myId };
      const [usersResponse, groupsResponse] = await Promise.all([
        getUsersForSidebar(params),
        getGroupsAPI(),
      ]);
      if (usersResponse?.success) {
        const users = (usersResponse?.data || []).map((d: TUser) => ({
          ...d,
          img: d?.img || "",
          name: toStartCaseStr(d?.name),
        }));
        const groups = (groupsResponse?.success ? groupsResponse.data : []).map(
          (group: TUser) => ({
            ...group,
            id: String(group.id),
            name: group.name,
            isGroup: true,
            img: "",
          }),
        );
        const conversation = [...users, ...groups];

        if (conversation?.length > 0) {
          dispatch(SET_RECEIVER_ID(String(conversation[0].id)));
          dispatch(SET_USERS(conversation));
        }
      }
    } catch (error) {
      console.error("Failed to fetch sidebar users:", error);
    }
  };

  useEffect(() => {
    if (!loginUser?.id) {
      checkAuthRes(dispatch, setIsLoading);
    } else {
      if (!loginUser?.is_account_verified) {
        navigate("/");
        showToast(WARNING, CONFIRM_MESSAGE);
      } else {
        getAllUsers();
      }
    }
  }, [loginUser]);

  // Sync sidebar/chat view depending on device + active receiver
  useEffect(() => {
    if (!isMobile) {
      setMobileChatOpen(false);
      return;
    }
    if (receiverId) setMobileChatOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receiverId, isMobile]);

  const handleBack = () => {
    setMobileChatOpen(false);
    dispatch(SET_RIGHT_SIDEBAR_OPEN_STATUS(false));
  };

    const showSidebar = !isMobile ? true : !mobileChatOpen;
  const showChat = !isMobile ? true : mobileChatOpen && !!receiverId;

  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          height: "100dvh",
          overflow: "hidden",
          backgroundColor: theme.palette.background.default,
        }}
      >
        {/* ── Left sidebar ── */}
        <Box
          component="nav"
          aria-label="conversations"
          sx={{
            width: LEFT_DRAWER_WIDTH,
            flexShrink: 0,
            display: showSidebar ? "flex" : "none",
            flexDirection: "column",
            borderRight: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper,
            overflow: "hidden",
            transform: { xs: showSidebar ? "translateX(0)" : "translateX(-100%)" },
            transition: "transform 220ms ease",
            zIndex: theme.zIndex.drawer,
          }}
        >
          <LeftSiteBar
            onSelectChat={() => setMobileChatOpen(true)}
            activeConversation={receiverId}
          />
        </Box>

        {/* ── Main chat column ── */}
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            display: showChat ? "flex" : "none",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <ChatHeader
            isDrawer
            showBack={isMobile && mobileChatOpen}
            onBack={handleBack}
            toggleProfileSidebar={handleRightSidebarToggle}
            profileSidebarOpen={isRightSidebarOpen}
          />

          <Box
            component="main"
            sx={{ flex: 1, minHeight: 0, overflowY: "auto", overflowX: "hidden" }}
          >
            {!receiverId ? (
              <EmptyState
                title="Select a conversation"
                description="Choose a conversation from the sidebar to start messaging."
                icon={<ChatBubbleOutlineRoundedIcon sx={{ fontSize: 34 }} />}
              />
            ) : (
              <Message />
            )}
          </Box>

          <Box
            sx={{
              px: { xs: 1.5, sm: 2.5 },
              pb: 1.5,
              pt: 1,
              borderTop: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.background.paper,
            }}
          >
            {receiverId ? (
              <SearchField myId={myId} />
            ) : (
              <Box sx={{ height: 72 }} />
            )}
          </Box>
        </Box>

        {/* ── Right info drawer ── */}
        {isRightSidebarOpen && (
          <>
            {/* desktop static */}
            <Box
              sx={{
                width: RIGHT_DRAWER_WIDTH,
                display: { xs: "none", md: "flex" },
                flexDirection: "column",
                borderLeft: `1px solid ${theme.palette.divider}`,
                backgroundColor: theme.palette.background.paper,
                height: "100%",
                overflowY: "auto",
              }}
            >
              <RightSidebar />
            </Box>

            {/* mobile overlay */}
            <Box
              sx={{
                display: { xs: "block", md: "none" },
                position: "fixed",
                inset: 0,
                zIndex: theme.zIndex.modal,
                backgroundColor: "rgba(0,0,0,0.4)",
              }}
              onClick={handleRightSidebarToggle}
            />
            <Box
              sx={{
                display: { xs: "block", md: "none" },
                position: "fixed",
                top: 0,
                right: 0,
                bottom: 0,
                width: "85%",
                maxWidth: "368px",
                zIndex: theme.zIndex.modal + 1,
                backgroundColor: theme.palette.background.paper,
                borderLeft: `1px solid ${theme.palette.divider}`,
                boxShadow: "-16px 0 40px rgba(0,0,0,0.45)",
                transform: isRightSidebarOpen ? "translateX(0)" : "translateX(100%)",
                transition: "transform 240ms ease",
                overflowY: "auto",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <RightSidebar />
            </Box>
          </>
        )}
      </Box>

      <Loader loading={isLoading} title="Chat Loading..." />
    </>
  );
}

// placeholder for default export
export default ChatContainer;