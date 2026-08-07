/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import {
  SET_CONVERSATION,
  SET_RECEIVER_ID,
  SET_REPLIED_MESSAGE,
} from "../../redux/features/chat/conversationSlice";
import { getMessage } from "../../services/message";
import { RootState } from "../../redux/store";
import { TUser } from "../../types";
import { groupMessagesByDate } from "../../utils/timeFormat";
import logoImage from "../../assets/logo.png";
import { formattedSideBarData } from "../../utils/common";
import LeftSiteBarCard from "../../components";

const LeftSiteBar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loginUser, allUsers } = useSelector(
    (state: RootState) => state?.auth,
  );
  const { receiverId, messages } = useSelector(
    (state: RootState) => state?.message,
  );
  const { id: myId } = loginUser || {};

  const handleClick = async (user: Partial<TUser>) => {
    try {
      const params = {
        myId,
        userToChatId: user.id,
      };
      if (user.id) {
        dispatch(SET_RECEIVER_ID(user.id));
      }
      dispatch(SET_REPLIED_MESSAGE({}));
      const res = await getMessage(params);
      if (res?.success) {
        const formattedMessage = groupMessagesByDate(res?.data);
        dispatch(SET_CONVERSATION(formattedMessage));
      }
    } catch (error) {
      console.error("Error loading chat messages:", error);
    }
  };

  useEffect(() => {
    if (Object.keys(messages).length === 0 && !!receiverId) {
      handleClick({ id: receiverId });
    }
  }, [receiverId]);

  const formattedAllUsers = useMemo(() => {
    return allUsers?.length > 0 ? formattedSideBarData(allUsers) : [];
  }, [allUsers, messages]);

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Sidebar Header */}
      <List disablePadding>
        <ListItem disablePadding>
          <Stack
            direction="row"
            spacing={1.5}
            sx={{
              width: "100%",
              px: 2.5,
              py: 2,
              alignItems: "center",
            }}
          >
            <Avatar
              onClick={() => navigate("/")}
              alt="logo"
              src={logoImage}
              sx={{
                width: 36,
                height: 36,
                cursor: "pointer",
                transition: "transform 0.2s ease",
                "&:hover": { transform: "scale(1.05)" },
              }}
            />
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: theme.palette.text.primary }}
            >
              Chatty
            </Typography>
          </Stack>
        </ListItem>
      </List>

      <Divider sx={{ borderColor: theme.palette.divider }} />

      {/* User List */}
      <List sx={{ pt: 1, px: 1, flexGrow: 1, overflowY: "auto" }}>
        {formattedAllUsers
          ?.filter((d: TUser) => d?.id !== myId)
          ?.map((user: TUser) => (
            <ListItem key={user.id} disablePadding sx={{ mb: 0.5 }}>
              <LeftSiteBarCard user={user} onClick={handleClick} />
            </ListItem>
          ))}
      </List>
    </Box>
  );
};

export default LeftSiteBar;
