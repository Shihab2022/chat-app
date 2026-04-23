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
          marginBottom: "20px",
        }}
      >
        <Typography variant="h5">Contact Information</Typography>
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
              {selectedUserInfo?.name?.slice(0, 2).toUpperCase()}
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
      <Typography variant="h6">{selectedUserInfo?.bio}</Typography>
      <Divider sx={{ my: 2 }} />

      {rightSideActionInfo.map((action) => (
        <Stack
          key={action.id}
          direction="row"
          spacing={1}
          sx={{
            cursor: "pointer",
            color: action.isRed ? "red" : "black",

            paddingX: "15px",
            paddingY: "7px",
            borderRadius: "4px",
            alignItems: "center",
            "&:hover": {
              background: action.isRed
                ? "rgba(245, 39, 39, 0.1)"
                : "rgba(0, 0, 0, 0.1)",
            },
          }}
        >
          <action.icon sx={{ fontSize: "1.7rem" }} />
          <Typography variant="h6">{action.title}</Typography>
        </Stack>
      ))}
    </Box>
  );
};
