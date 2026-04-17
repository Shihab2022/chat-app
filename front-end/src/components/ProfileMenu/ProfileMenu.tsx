/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import { useDispatch, useSelector } from "react-redux";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { RootState } from "../../redux/store";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { disconnectSocket } from "../../utils/socketService";
import { checkAuthRes } from "../../utils/checkAuth";
import { ACCESS_TOKEN_KEY, CURRENT_PATH_KEY } from "../../constants/common";
const profileMenuStyle = {
  color: "#A1B0CC",
  fontSize: "30px",
  marginRight: 1,
};
const ProfileMenuItem = ({ onClick, label, icon }: any) => {
  return (
    <MenuItem
      sx={{
        display: "flex",
        alignItems: "center",
      }}
      onClick={() => onClick()}
    >
      {icon}
      <Typography variant="h5" sx={{ fontSize: "15px" }}>
        {label}
      </Typography>
    </MenuItem>
  );
};
const ProfileMenu = ({ HeaderComp }: any) => {
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const userInfo = useSelector((state: RootState) => state?.auth?.loginUser);
  const { loginUser } = useSelector((state: RootState) => state?.auth);
  const [isLoading, setIsLoading] = React.useState(false);
  const { id: myId } = loginUser;
  const dispatch = useDispatch();
  //   const dispatch = useDispatch();
  //   const [availableCredits, setAvailableCredits] = useState(0);
  // console.log({ userInfo });
  const navigate = useNavigate();
  useEffect(() => {
    checkAuthRes(dispatch, setIsLoading);
  }, []);
  const handleOpenUserMenu = async (event: any) => {
    try {
      setAnchorElUser(event.currentTarget);
      //   const credits = await getCredits();
      //   if (credits?.data?.success) {
      //     const cre = credits?.data?.data?.credits || 0;
      //     setAvailableCredits(cre);
      //     dispatch({ type: SET_CREDITS, credits: cre });
      //   }
    } catch (error) {
      console.log(error);
    }
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const handleLogout = async () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(CURRENT_PATH_KEY);
    disconnectSocket();
    navigate("/login");
  };
  const handleMenu = (value: any) => {
    handleCloseUserMenu();
    switch (value) {
      case "dashboard":
        navigate("/chat");
        break;
      case "profile":
        navigate(`/profile/id=${myId}`);
        break;
      case "changePassword":
        navigate("/forgetPassword");
        break;
      case "inviteUser":
        navigate("/inviteUser");
        break;
      case "manageUser":
        navigate("/manageUser");
        break;
      case "logout":
        handleLogout();
        break;
      default:
        setAnchorElUser(null);
    }
  };

  const userImage = `data:image/jpeg;base64,${userInfo.profileImage}`;
  useEffect(() => {
    if (!userInfo.profileImage) {
      handleProfileImageCall();
    }
  }, [userInfo.profileImage]);

  const handleProfileImageCall = async () => {
    // const imageData = await getProfileImage({ email: userInfo.email });
    // if (imageData.success) {
    //   dispatch({ type: SET_USER_PROFILE_IMAGE, payload: imageData.data });
    // }
  };

  return (
    <>
      <Box sx={{ flexGrow: 0 }}>
        <Stack
          direction="row-reverse"
          justifyContent="center"
          alignItems="center"
          spacing={1}
        >
          <Tooltip title="Profile Menu">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              {userInfo.img ? (
                <Avatar
                  // src={userInfo.profileImage ? userImage : userInfo.image}
                  src={userInfo.img || ""}
                />
              ) : (
                <Avatar sx={{ background: "#7c4dff", color: "white" }}>
                  {userInfo?.name?.slice(0, 1).toUpperCase()}
                </Avatar>
              )}
            </IconButton>
          </Tooltip>
          {/* {!HeaderComp && (
            <Box sx={{ color: "black" }}>
              <Typography sx={{ textAlign: "right" }}>
                {userInfo?.email}
              </Typography>
              <Typography sx={{ textAlign: "right" }}>
                {userInfo?.organisation}
              </Typography>
            </Box>
          )} */}
        </Stack>

        <Menu
          sx={{ mt: "45px" }}
          id="menu-appbar"
          anchorEl={anchorElUser}
          anchorOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
          PaperProps={{
            sx: {
              minWidth: "250px",
              borderRadius: "5px",
              zIndex: 20,
              backgroundColor: "white",
              paddingY: "10px",
              border: "1px solid rgba(0, 0, 0, 0.1)",
            },
          }}
        >
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
                <Avatar sx={{ background: "#7c4dff", color: "white" }}>
                  {userInfo?.name?.slice(0, 1).toUpperCase()}
                </Avatar>
              )}
            </Box>
          </Stack>
          <Typography
            sx={{
              fontWeight: "bold",
              fontSize: ".9rem",
              color: "black",
              textAlign: "center",
              lineHeight: ".4rem",
              marginTop: "10px",
            }}
          >
            {userInfo?.email}
          </Typography>
          <Typography
            sx={{
              color: "black",
              textAlign: "center",
              lineHeight: ".4rem",
              marginTop: "13px",
            }}
          >
            {userInfo?.name}
          </Typography>

          <Stack
            justifyContent="center"
            alignItems="center"
            sx={{ marginTop: "10px" }}
          >
            <Button
              variant="contained"
              color="secondary"
              sx={{ boxShadow: "none" }}
              onClick={() => handleMenu("dashboard")}
            >
              Dashboard
            </Button>
          </Stack>
          <ProfileMenuItem
            onClick={() => handleMenu("profile")}
            label="Profile"
            icon={<AccountCircleOutlinedIcon sx={profileMenuStyle} />}
          />
          {!userInfo?.google_login && (
            <ProfileMenuItem
              onClick={() => handleMenu("changePassword")}
              label="Change Password"
              icon={<LockResetOutlinedIcon sx={profileMenuStyle} />}
            />
          )}

          <ProfileMenuItem
            onClick={() => handleMenu("inviteUser")}
            label="Invite User"
            icon={<PersonAddIcon sx={profileMenuStyle} />}
          />
          <ProfileMenuItem
            onClick={() => handleMenu("manageUser")}
            label="Manage Users"
            icon={<ManageAccountsOutlinedIcon sx={profileMenuStyle} />}
          />
          <ProfileMenuItem
            onClick={() => handleMenu("logout")}
            label="Log Out"
            icon={<LogoutIcon sx={profileMenuStyle} />}
          />
        </Menu>
      </Box>
    </>
  );
};

export default ProfileMenu;
