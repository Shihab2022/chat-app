import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Homepage from "../components";
import { demoUser, myProfile } from "../constants/demoUserData";
import SearchField from "../components/searchField";
import { messageData } from "../constants/messageData";
import Message from "../components/message";
import Profile from "../components/profile";
import { showToast } from "../utils/toast";
import { FAILED, SUCCESS } from "../constants/common";

const drawerWidth = 340;

function ResponsiveDrawer(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [messages, setMessages] = React.useState(messageData);
  const [friends, setFriends] = React.useState(messageData);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const getUser = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/invite/getConversation/${id}`
      );
      const result = await response.json();
      if (result.success) {
        let data = [];
        result?.data?.participants?.forEach((d, i) => {
          data.push({
            ...d,
            img: `https://randomuser.me/api/portraits/men/${i + 1}.jpg`,
            name: d.participant.slice(0, 10),
            time: `${i + 1}h`,
          });
        });
        setFriends(data);
        showToast(SUCCESS, result.message);
      } else {
        // setMessages(messageData);
        showToast(FAILED, "Something is wrong ! ");
      }
    } catch (error) {
      showToast(FAILED, "Something is wrong ! ");
    }
  };
  React.useEffect(() => {
    getUser(myProfile.id);
  }, []);
  const handleClick = async (user) => {
    const messagesId = {
      senderId: myProfile.id,
      receiverId: user.id,
    };

    try {
      const response = await fetch(
        "http://localhost:5000/api/message/getMessage",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(messagesId),
        }
      );
      const result = await response.json();
      if (result.success) {
        setMessages(result?.data);
        showToast(SUCCESS, result.message);
      } else {
        setMessages(messageData);
        showToast(FAILED, "Something is wrong ! ");
      }
    } catch (error) {
      showToast(FAILED, "Something is wrong ! ");
    }
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
