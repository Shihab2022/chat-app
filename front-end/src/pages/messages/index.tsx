/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import SearchField from "../../components/searchField";
import Message from "../../components/messages/message";
import { useEffect, useState } from "react";
import { getUsersForSidebar } from "../../services/message";
import { toStartCaseStr } from "../../utils/common";
import { useDispatch, useSelector } from "react-redux";
import { checkAuthRes } from "../../utils/checkAuth";
import { SET_RECEIVER_ID } from "../../redux/features/chat/conversationSlice";
import { SET_ALL_USERS } from "../../redux/features/auth/authSlice";
import LeftSiteBar from "./leftSiteBar";
import { RootState } from "../../redux/store";
import {
  CONFIRM_MESSAGE,
  DRAWER_WIDTH,
  RIGHT_DRAWER_WIDTH,
  WARNING,
} from "../../constants/common";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../utils/toast";
import Loader from "../../components/loader";
import { RightSidebar } from "./rightSiteBar";

function ChatContainer() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { loginUser } = useSelector((state: RootState) => state?.auth);
  const { isRightSidebarOpen } = useSelector(
    (state: RootState) => state?.message,
  );
  const navigate = useNavigate();
  const { id: myId } = loginUser;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const dispatch = useDispatch();

  const getAllUsers = async () => {
    try {
      const params = { id: myId };
      const res = await getUsersForSidebar(params);
      if (res?.success) {
        const resUsers = res?.data;
        const conversation = resUsers?.map((d: any) => {
          const img = d?.img || "";
          return {
            ...d,
            img,
            name: toStartCaseStr(d?.name),
          };
        });
        dispatch(SET_RECEIVER_ID(conversation[0].id));
        dispatch(SET_ALL_USERS(conversation));
      }
    } catch (error) {
      console.log({ error });
    }
  };

  useEffect(() => {
    if (!loginUser?.id) {
      checkAuthRes(dispatch, setIsLoading);
    } else {
      console.log({ loginUser });
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
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <Box
          component="nav"
          sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}
          aria-label="mailbox folders"
        >
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: DRAWER_WIDTH,
              },
            }}
          >
            <LeftSiteBar />
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", sm: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: DRAWER_WIDTH,
              },
            }}
            open
          >
            <LeftSiteBar />
          </Drawer>
        </Box>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: {
              sm: isRightSidebarOpen
                ? `calc(100% - ${DRAWER_WIDTH + RIGHT_DRAWER_WIDTH}px)`
                : `calc(100% - ${DRAWER_WIDTH}px)`,
            },
          }}
        >
          <Box sx={{ marginBottom: "50px" }}>
            <Message />
          </Box>
          <Box
            sx={{
              position: "fixed",
              bottom: 5,
              width: {
                sm: isRightSidebarOpen
                  ? `calc(100% - ${DRAWER_WIDTH + RIGHT_DRAWER_WIDTH + 40}px)`
                  : `calc(100% - ${DRAWER_WIDTH + 40}px)`,
              },
            }}
          >
            <SearchField myId={myId} />
          </Box>
        </Box>

        {isRightSidebarOpen && (
          <Box
            sx={{
              width: RIGHT_DRAWER_WIDTH,
              display: { xs: "none", md: "block" },
              borderLeft: "1px solid #e0e0e0",
              p: 2,
              bgcolor: "#fafafa",
              height: "100vh",
              position: "sticky",
              top: 0,
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
