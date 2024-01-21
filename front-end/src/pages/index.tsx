import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Homepage from "../components";
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

const drawerWidth = 340;

function ResponsiveDrawer(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [messages, setMessages] = React.useState(messageData);
  const [friends, setFriends] = React.useState(messageData);
  const { data, isSuccess, isError } = useGetConversationQuery(
    "659798b8df9f194773891c12"
  );
  const [getMessage, { data: message, isSuccess: isMessageSuccess }] =
    useGetMessageMutation();
  const dispatch = useAppDispatch();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  React.useEffect(() => {
    if (isMessageSuccess) {
      // setMessages(message.data);
      showToast(SUCCESS, data.message);
    }
  }, [isMessageSuccess, message]);
  React.useEffect(() => {
    if (isSuccess) {
      const conversation = data?.data?.participants?.map((d, i) => ({
        ...d,
        img: `https://randomuser.me/api/portraits/men/${i + 1}.jpg`,
        name: d.participant.slice(0, 10),
        time: `${i + 1}h`,
      }));

      if (conversation.length > 0) {
        dispatch(setConversation(conversation));
        setFriends(conversation);
        showToast(SUCCESS, data.message);
      }
    }

    if (isError) {
      showToast(FAILED, "Something is wrong!");
    }
  }, [data, isSuccess, isError]);

  const handleClick = async (user) => {
    const messagesId = {
      senderId: myProfile.id,
      receiverId: user.id,
    };
    getMessage(messagesId);
  };
  const drawer = (
    <div>
      {/* <Toolbar /> */}

      <List>
        <ListItem disablePadding>
          <Profile user={myProfile} onClick={handleClick} />
        </ListItem>
      </List>
      <Divider />
      <List>
        {friends?.map((user, i) => (
          <>
            <ListItem key={i} disablePadding>
              <Homepage user={user} onClick={handleClick} />
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
