import { Avatar, Box, Divider, Stack, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { RootState } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { rightSideActionInfo } from "../../constants/common";
import { TUser } from "../../types";
import { useMemo } from "react";
import { SET_RIGHT_SIDEBAR_OPEN_STATUS } from "../../redux/features/chat/conversationSlice";
export const RightSidebar = () => {
  const dispatch = useDispatch();
  const { receiverId } = useSelector((state: RootState) => state?.message);
  const { allUsers } = useSelector((state: RootState) => state?.auth);
  const selectedUserInfo = useMemo(() => {
    if (allUsers?.length > 0 && receiverId) {
      const user = allUsers.find((u: TUser) => u?.id === receiverId);
      return user;
    }
  }, [receiverId]);
  const userImage = `data:image/jpeg;base64,${selectedUserInfo?.profileImage}`;
  return (
    <Box>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "10px",
        }}
      >
        <Typography variant="body1">Contact Information</Typography>
        <CloseIcon
          sx={{ cursor: "pointer" }}
          onClick={() => dispatch(SET_RIGHT_SIDEBAR_OPEN_STATUS(false))}
        />
      </Stack>

      <Stack
        justifyContent="center"
        alignItems="center"
        sx={{ cursor: "context-menu" }}
      >
        <Box
          sx={{
            width: 56,
            height: 56,
            marginBottom: "5px",
          }}
        >
          {selectedUserInfo?.img ? (
            <Avatar
              src={selectedUserInfo?.img ? selectedUserInfo?.img : userImage}
            />
          ) : (
            <Avatar
              sx={{
                background: "#7c4dff",
                color: "white",
                width: 70,
                height: 70,
              }}
            >
              {selectedUserInfo?.name?.slice(0, 1).toUpperCase()}
            </Avatar>
          )}
        </Box>
      </Stack>
      <Typography
        sx={{
          color: "black",
          textAlign: "center",
          lineHeight: ".4rem",
          marginTop: "30px",
        }}
      >
        {selectedUserInfo?.name}
      </Typography>
      <Typography
        sx={{
          fontWeight: "bold",
          fontSize: ".9rem",
          color: "black",
          textAlign: "center",
          lineHeight: ".4rem",
          marginTop: "20px",
        }}
      >
        {selectedUserInfo?.email}
      </Typography>
      <Typography sx={{ mt: 5 }}>About</Typography>
      <Typography>{selectedUserInfo?.bio}</Typography>
      <Divider sx={{ my: 2 }} />

      {rightSideActionInfo.map((action) => (
        <Stack
          key={action.id}
          direction="row"
          spacing={2}
          sx={{ cursor: "pointer" }}
        >
          <action.icon />
          <Typography variant="body2">{action.title}</Typography>
        </Stack>
      ))}
    </Box>
  );
};
