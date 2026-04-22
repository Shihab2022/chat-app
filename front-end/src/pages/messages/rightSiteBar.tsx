import { Avatar, Box, Divider, Stack, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { rightSideActionInfo } from "../../constants/common";
export const RightSidebar = () => {
  const userInfo = useSelector((state: RootState) => state?.auth?.loginUser);
  const userImage = `data:image/jpeg;base64,${userInfo.profileImage}`;
  console.log({ userInfo });
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
        <CloseIcon />
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
          {userInfo.img ? (
            <Avatar src={userInfo.img ? userInfo.img : userImage} />
          ) : (
            <Avatar
              sx={{
                background: "#7c4dff",
                color: "white",
                width: 70,
                height: 70,
              }}
            >
              {userInfo?.name?.slice(0, 1).toUpperCase()}
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
        {userInfo?.name}
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
        {userInfo?.email}
      </Typography>
      <Typography sx={{ mt: 5 }}>About</Typography>
      <Typography>{userInfo?.bio}</Typography>
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
