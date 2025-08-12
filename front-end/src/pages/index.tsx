/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import SearchField from "../components/searchField";
import { messageData } from "../constants/messageData";
import Message from "../components/message";
import Profile from "../components/profile";
import { useEffect, useState } from "react";
import { getMessage, getUsersForSidebar } from "../services/message";
import { randomTwoDigit, toStartCaseStr } from "../utils/common";
import LeftSiteBar from "../components";
import { useDispatch, useSelector } from "react-redux";
import { checkAuthRes } from "../utils/checkAuth";

const drawerWidth = 340;

function ResponsiveDrawer(props: { window: any }) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [messages, setMessages] = useState(messageData);
  const [allUsers, setAllUsers] = useState([]);
  const [receiverId, serReceiverId] = useState("");
  const { loginUser } = useSelector((state) => state?.auth);
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
        const conversation = resUsers?.map((d: any) => ({
          ...d,
          img: `https://randomuser.me/api/portraits/men/${randomTwoDigit()}.jpg`,
          name: toStartCaseStr(d?.name),
        }));

        setAllUsers(conversation);
        serReceiverId(conversation[0]._id);
      }
    } catch (error) {
      console.log({ error });
    }
  };
  useEffect(() => {
    getAllUsers();
  }, []);

  const handleClick = async (user: any) => {
    try {
      const params = {
        myId,
        userToChatId: user._id,
      };
      serReceiverId(user._id);
      const res = await getMessage(params);
      console.log({ res });
    } catch (error) {
      console.log({ error });
    }
  };
  const drawer = (
    <div>
      {/* <Toolbar /> */}

      <List>
        <ListItem disablePadding>
          <Profile user={loginUser} />
        </ListItem>
      </List>
      <Divider />
      <List>
        {allUsers
          ?.filter((d: any) => d?._id !== myId)
          ?.map((user, i) => (
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
          <SearchField receiverId={receiverId} myId={myId} />
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
