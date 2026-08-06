/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import MenuIcon from "@mui/icons-material/Menu";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { alpha, useTheme } from "@mui/material/styles";

import SearchField from "../../components/searchField";
import Message from "../../components/messages/message";
import LeftSiteBar from "./leftSiteBar";
import { RightSidebar } from "./rightSiteBar";
import Loader from "../../components/loader";
import { getUsersForSidebar } from "../../services/message";
import { toStartCaseStr } from "../../utils/common";
import { checkAuthRes } from "../../utils/checkAuth";
import {
  SET_RECEIVER_ID,
  SET_RIGHT_SIDEBAR_OPEN_STATUS,
} from "../../redux/features/chat/conversationSlice";
import { SET_ALL_USERS } from "../../redux/features/auth/authSlice";
// Import your right sidebar toggle action (adjust path if needed)

import { RootState } from "../../redux/store";
import {
  CONFIRM_MESSAGE,
  DRAWER_WIDTH,
  RIGHT_DRAWER_WIDTH,
  WARNING,
} from "../../constants/common";
import { showToast } from "../../utils/toast";
import { TUser } from "../../types";

function ChatContainer() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { loginUser, allUsers } = useSelector(
    (state: RootState) => state?.auth,
  );
  const { isRightSidebarOpen, receiverId } = useSelector(
    (state: RootState) => state?.message,
  );
  const { id: myId } = loginUser || {};

  // Active receiver profile details for header & mobile view
  const activeUser = allUsers?.find((u: TUser) => u.id === receiverId);

  // Toggle Left Contact Drawer (Mobile)
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Toggle Right Profile Sidebar (Mobile & Desktop)
  const handleRightSidebarToggle = () => {
    if (SET_RIGHT_SIDEBAR_OPEN_STATUS) {
      dispatch(SET_RIGHT_SIDEBAR_OPEN_STATUS(!isRightSidebarOpen));
    }
  };

  const getAllUsers = async () => {
    try {
      const params = { id: myId };
      const res = await getUsersForSidebar(params);
      if (res?.success) {
        const resUsers = res?.data;
        const conversation = resUsers?.map((d: TUser) => ({
          ...d,
          img: d?.img || "",
          name: toStartCaseStr(d?.name),
        }));

        if (conversation?.length > 0) {
          dispatch(SET_RECEIVER_ID(conversation[0].id));
          dispatch(SET_ALL_USERS(conversation));
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

  // Auto-close left drawer on mobile when active conversation changes
  useEffect(() => {
    setMobileOpen(false);
  }, [receiverId]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          backgroundColor: theme.palette.background.default,
        }}
      >
        <CssBaseline />

        {/* Mobile Header Bar (Visible on mobile/tablet screens < md)          */}
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            display: { xs: "flex", md: "none" },
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            borderBottom: `1px solid ${theme.palette.divider}`,
            zIndex: theme.zIndex.drawer + 1,
          }}
        >
          <Toolbar sx={{ justifyContent: "space-between" }}>
            {/* Left: Contacts Drawer Menu Button */}
            <IconButton
              color="inherit"
              aria-label="open contacts drawer"
              edge="start"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>

            {/* Center: Active Receiver Info (Clickable to open Right Profile Sidebar) */}
            <Box
              onClick={handleRightSidebarToggle}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.2,
                cursor: "pointer",
                px: 1,
                py: 0.5,
                borderRadius: 2,
                "&:hover": {
                  backgroundColor: alpha(theme.palette.action.hover, 0.08),
                },
              }}
            >
              <Avatar
                src={activeUser?.img}
                alt={activeUser?.name || "User"}
                sx={{ width: 34, height: 34 }}
              />
              <Typography
                variant="subtitle1"
                noWrap
                sx={{ fontWeight: 600, fontSize: "0.95rem" }}
              >
                {activeUser?.name || "Select Chat"}
              </Typography>
            </Box>

            {/* Right: Toggle Profile Info Sidebar Button */}
            <IconButton
              color={isRightSidebarOpen ? "primary" : "inherit"}
              aria-label="open user profile sidebar"
              edge="end"
              onClick={handleRightSidebarToggle}
            >
              <InfoOutlinedIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Left Contacts Sidebar Drawer                                       */}

        <Box
          component="nav"
          sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}
          aria-label="chat contacts"
        >
          {/* Mobile Temporary Left Drawer */}
          <Drawer
            variant="temporary"
            anchor="left"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: DRAWER_WIDTH,
                backgroundColor: theme.palette.background.paper,
                borderColor: theme.palette.divider,
              },
            }}
          >
            <LeftSiteBar />
          </Drawer>

          {/* Desktop Permanent Left Drawer */}
          <Drawer
            variant="permanent"
            open
            sx={{
              display: { xs: "none", sm: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: DRAWER_WIDTH,
                backgroundColor: theme.palette.background.paper,
                borderColor: theme.palette.divider,
              },
            }}
          >
            <LeftSiteBar />
          </Drawer>
        </Box>

        {/* Main Chat Content Area                                              */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 3 },
            pt: { xs: 9, md: 3 }, // Added top padding for mobile app bar
            pb: 10,
            width: {
              sm: isRightSidebarOpen
                ? `calc(100% - ${DRAWER_WIDTH + RIGHT_DRAWER_WIDTH}px)`
                : `calc(100% - ${DRAWER_WIDTH}px)`,
            },
            transition: theme.transitions.create(["width", "margin"], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }}
        >
          <Box sx={{ mb: 4 }}>
            <Message />
          </Box>

          {/* Fixed Floating Bottom Input Field */}
          <Box
            sx={{
              position: "fixed",
              bottom: 16,
              zIndex: theme.zIndex.drawer - 1,
              width: {
                xs: "calc(100% - 32px)",
                sm: isRightSidebarOpen
                  ? `calc(100% - ${DRAWER_WIDTH + RIGHT_DRAWER_WIDTH + 48}px)`
                  : `calc(100% - ${DRAWER_WIDTH + 48}px)`,
              },
              transition: theme.transitions.create(["width", "left"], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            }}
          >
            <SearchField myId={myId} />
          </Box>
        </Box>

        {/* Right Info / Profile Sidebar (Mobile Temporary & Desktop Sticky)   */}

        {/* Mobile Right Drawer (xs & sm screens) */}
        <Drawer
          variant="temporary"
          anchor="right"
          open={isRightSidebarOpen}
          onClose={handleRightSidebarToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: { xs: "85%", sm: RIGHT_DRAWER_WIDTH },
              maxWidth: RIGHT_DRAWER_WIDTH,
              backgroundColor: theme.palette.background.paper,
              p: 2,
            },
          }}
        >
          <RightSidebar />
        </Drawer>

        {/* Desktop Sticky Right Sidebar (md screens and above) */}
        {isRightSidebarOpen && (
          <Box
            sx={{
              width: RIGHT_DRAWER_WIDTH,
              display: { xs: "none", md: "block" },
              borderLeft: `1px solid ${theme.palette.divider}`,
              p: 2.5,
              backgroundColor: alpha(theme.palette.background.paper, 0.85),
              backdropFilter: "blur(8px)",
              height: "100vh",
              position: "sticky",
              top: 0,
              overflowY: "auto",
            }}
          >
            <RightSidebar />
          </Box>
        )}
      </Box>

      <Loader loading={isLoading} title="Chat Loading..." />
    </>
  );
}

export default ChatContainer;
