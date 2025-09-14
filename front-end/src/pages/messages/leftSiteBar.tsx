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
} from "../../redux/features/chat/getConversationSlice";
import { getMessage } from "../../services/message";
import { RootState } from "../../redux/store";
import { TUser } from "../../types";
import { groupMessagesByDate } from "../../utils/timeFormat";
import { Typography } from "@mui/material";

const LeftSiteBar = () => {
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
          <Typography variant="h1">Chatty</Typography>
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
