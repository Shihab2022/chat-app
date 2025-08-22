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
import { randomTwoDigit, toStartCaseStr } from "../../utils/common";
import { useDispatch, useSelector } from "react-redux";
import { checkAuthRes } from "../../utils/checkAuth";
import { SET_RECEIVER_ID } from "../../redux/features/chat/getConversationSlice";
import { SET_ALL_USERS } from "../../redux/features/auth/authSlice";
import LeftSiteBar from "./leftSiteBar";
import { RootState } from "../../redux/store";
import { DRAWER_WIDTH } from "../../constants/common";
import NavBar from "./navBar";
import EmojiPicker from "../../components/emoji";

function ChatContainer() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { loginUser } = useSelector((state: RootState) => state?.auth);
  const { _id: myId } = loginUser;
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const dispatch = useDispatch();
  useEffect(() => {
    if (!loginUser?._id) {
      checkAuthRes(dispatch);
    }
  }, []);
  const getAllUsers = async () => {
    try {
      const params = { _id: myId };
      const res = await getUsersForSidebar(params);
      if (res?.success) {
        const resUsers = res?.data;
        const conversation = resUsers?.map((d: any) => {
          const img =
            d?.img ||
            `https://randomuser.me/api/portraits/men/${randomTwoDigit()}.jpg`;
          return {
            ...d,
            img,
            name: toStartCaseStr(d?.name),
          };
        });
        dispatch(SET_RECEIVER_ID(conversation[0]._id));
        dispatch(SET_ALL_USERS(conversation));
      }
    } catch (error) {
      console.log({ error });
    }
  };
  useEffect(() => {
    getAllUsers();
  }, []);
  // const container =
  // window !== undefined ? () => window().document.body : undefined;

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <NavBar />
        <Box
          component="nav"
          sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}
          aria-label="mailbox folders"
        >
          <Drawer
            // container={container}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
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
            width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          }}
        >
          <Box sx={{ marginBottom: "50px" }}>
            <Message />
          </Box>
          <Box
            sx={{
              position: "fixed",
              bottom: 5,
              width: { sm: `calc(100% - ${DRAWER_WIDTH + 40}px)` },
            }}
          >
            <SearchField myId={myId} />
          </Box>
        </Box>
      </Box>
    </>
  );
}
export default ChatContainer;
