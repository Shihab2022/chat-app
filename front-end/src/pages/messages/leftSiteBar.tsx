/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import LeftSiteBarCard from "../../components";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  SET_CONVERSATION,
  SET_RECEIVER_ID,
  SET_REPLIED_MESSAGE,
} from "../../redux/features/chat/conversationSlice";
import { getMessage } from "../../services/message";
import { RootState } from "../../redux/store";
import { TUser } from "../../types";
import { groupMessagesByDate } from "../../utils/timeFormat";
import { Avatar, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import logoImage from "../../assets/logo.png";
const LeftSiteBar = () => {
  const navigate = useNavigate();
  const { loginUser, allUsers } = useSelector(
    (state: RootState) => state?.auth
  );
  const { receiverId, messages } = useSelector(
    (state: RootState) => state?.message
  );
  const { _id: myId } = loginUser;
  const dispatch = useDispatch();
  const handleClick = async (user: any) => {
    try {
      const params = {
        myId,
        userToChatId: user._id,
      };
      dispatch(SET_RECEIVER_ID(user._id));
      dispatch(SET_REPLIED_MESSAGE({}));
      const res = await getMessage(params);
      if (res?.success) {
        const formattedMessage = groupMessagesByDate(res?.data);
        dispatch(SET_CONVERSATION(formattedMessage));
      }
    } catch (error) {
      console.log({ error });
    }
  };

  useEffect(() => {
    if (Object.keys(messages).length <= 0 && !!receiverId) {
      handleClick({ _id: receiverId });
    }
  }, [receiverId]);
  return (
    <>
      <List>
        <ListItem disablePadding>
          <Stack
            direction="row"
            spacing={2}
            sx={{
              justifyContent: "flex-start",
              alignItems: "center",
              width: "100%",
              marginLeft: "30px",
              paddingY: "20px",
            }}
          >
            <Stack
              direction="row"
              spacing={0.5}
              sx={{
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              {" "}
              <Avatar
                onClick={() => navigate("/")}
                alt={"logo"}
                src={logoImage}
                sx={{ width: 40, height: 40, mb: 2, cursor: "pointer" }}
              />
              <Typography variant="h6">Chatty</Typography>
            </Stack>
          </Stack>
        </ListItem>
      </List>
      <Divider />
      <List>
        {allUsers
          ?.filter((d: TUser) => d?._id !== myId)
          ?.map((user: TUser, i: number) => (
            <>
              <ListItem key={i} disablePadding>
                <LeftSiteBarCard user={user} onClick={handleClick} />
              </ListItem>
            </>
          ))}
      </List>
    </>
  );
};

export default LeftSiteBar;
