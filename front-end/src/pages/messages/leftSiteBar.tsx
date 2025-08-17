/* eslint-disable @typescript-eslint/no-explicit-any */
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Profile from "../../components/profile";
import LeftSiteBarCard from "../../components";
import { useDispatch, useSelector } from "react-redux";
import { Key, useEffect } from "react";
import {
  SET_CONVERSATION,
  SET_RECEIVER_ID,
} from "../../redux/features/chat/getConversationSlice";
import { getMessage } from "../../services/message";

const LeftSiteBar = () => {
  const { loginUser, allUsers } = useSelector((state) => state?.auth);
  const { receiverId, messages } = useSelector((state) => state?.message);
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
        dispatch(SET_CONVERSATION(res?.data));
      }
    } catch (error) {
      console.log({ error });
    }
  };

  useEffect(() => {
    if (messages.length <= 0 && !!receiverId) {
      handleClick({ _id: receiverId });
    }
  }, [receiverId]);
  return (
    <>
      <List>
        <ListItem disablePadding>
          <Profile user={loginUser} />
        </ListItem>
      </List>
      <Divider />
      <List>
        {allUsers
          ?.filter((d: any) => d?._id !== myId)
          ?.map((user: unknown, i: Key | null | undefined) => (
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
