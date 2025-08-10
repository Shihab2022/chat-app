/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { myProfile } from "../constants/demoUserData";
import SearchField from "../components/searchField";
import { messageData } from "../constants/messageData";
import Message from "../components/message";
import Profile from "../components/profile";
import { showToast } from "../utils/toast";
import { FAILED, SUCCESS } from "../constants/common";
import {
  useGetConversationQuery,
  useGetMessageMutation,
} from "../redux/features/chat/getConversation";
import { useAppDispatch } from "../redux/hooks";
import { setConversation } from "../redux/features/chat/getConversationSlice";
import { useEffect, useState } from "react";
import { getUsersForSidebar } from "../services/message";
import { toStartCaseStr } from "../utils/common";
import LeftSiteBar from "../components";
import { useSelector } from "react-redux";

const drawerWidth = 340;

function ResponsiveDrawer(props: { window: any }) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [messages, setMessages] = useState(messageData);
  const [allUsers, setAllUsers] = useState([]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const getAllUsers = async () => {
    try {
      const params = { _id: "6889a001631dd1680c6b16e4" };
      const res = await getUsersForSidebar(params);
      if (res?.success) {
        const resUsers = res?.data;
        const conversation = resUsers?.map((d: any, i: any) => ({
          ...d,
          img: `https://randomuser.me/api/portraits/men/${i + 1}.jpg`,
          name: toStartCaseStr(d?.name),
        }));
        setAllUsers(conversation);
      }
    } catch (error) {
      console.log({ error });
    }
  };
  useEffect(() => {
    getAllUsers();
  }, []);

  const handleClick = async (user: { id: any }) => {
    const messagesId = {
      senderId: myProfile.id,
      receiverId: user.id,
    };
    // getMessage(messagesId);
  };
  const drawer = (
    <div>
      {/* <Toolbar /> */}

      <List>
        <ListItem disablePadding>
          <Profile user={myProfile} />
        </ListItem>
      </List>
      <Divider />
      <List>
        {allUsers?.map((user, i) => (
          <>
            <ListItem key={i} disablePadding>
              <LeftSiteBar user={user} onClick={handleClick} />
            </ListItem>
          </>
        ))}
      </List>
    </div>
  );

  // Remove this const when copying and pasting into your project.
  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          container={container}
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
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Box sx={{ marginBottom: "50px" }}>
          <Message messageData={messages} />
        </Box>
        <Box
          sx={{
            position: "fixed",
            bottom: 5,
            width: { sm: `calc(100% - ${drawerWidth + 40}px)` },
          }}
        >
          <SearchField />
        </Box>
      </Box>
    </Box>
  );
}

ResponsiveDrawer.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * Remove this when copying and pasting into your project.
   */
  window: PropTypes.func,
};

export default ResponsiveDrawer;
