/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import { alpha, useTheme } from "@mui/material/styles";
import SearchField from "../../components/searchField";
import Message from "../../components/messages/message";
import LeftSiteBar from "./leftSiteBar";
import { RightSidebar } from "./rightSiteBar";
import Loader from "../../components/loader";
import { getUsersForSidebar } from "../../services/message";
import { toStartCaseStr } from "../../utils/common";
import { checkAuthRes } from "../../utils/checkAuth";
import { SET_RECEIVER_ID } from "../../redux/features/chat/conversationSlice";
import { SET_ALL_USERS } from "../../redux/features/auth/authSlice";
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

  const { loginUser } = useSelector((state: RootState) => state?.auth);
  const { isRightSidebarOpen } = useSelector(
    (state: RootState) => state?.message,
  );
  const { id: myId } = loginUser || {};

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
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

        {/* Navigation Sidebar Drawer */}
        <Box
          component="nav"
          sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}
          aria-label="chat contacts"
        >
          {/* Mobile Drawer */}
          <Drawer
            variant="temporary"
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

          {/* Desktop Permanent Drawer */}
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

        {/* Main Chat Content Area */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
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

          {/* Fixed Floating Bottom Message Input */}
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

        {/* Right Info Sidebar */}
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
