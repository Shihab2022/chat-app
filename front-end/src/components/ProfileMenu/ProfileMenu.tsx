import { useState, useEffect, ReactNode, MouseEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { alpha, useTheme } from "@mui/material/styles";

import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

import { RootState } from "../../redux/store";
import { disconnectSocket } from "../../utils/socketService";
import { checkAuthRes } from "../../utils/checkAuth";
import { ACCESS_TOKEN_KEY, CURRENT_PATH_KEY } from "../../constants/common";

interface ProfileMenuItemProps {
  onClick: () => void;
  label: string;
  icon: ReactNode;
  isDanger?: boolean;
}

const ProfileMenuItem = ({
  onClick,
  label,
  icon,
  isDanger = false,
}: ProfileMenuItemProps) => {
  const theme = useTheme();

  return (
    <MenuItem
      onClick={onClick}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        py: 1.25,
        px: 2,
        borderRadius: 1.5,
        mx: 0.5,
        color: isDanger ? theme.palette.error.main : theme.palette.text.primary,
        transition: "background-color 0.2s ease",
        "&:hover": {
          backgroundColor: isDanger
            ? alpha(theme.palette.error.main, 0.08)
            : alpha(theme.palette.action.hover, 0.08),
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          color: isDanger
            ? theme.palette.error.main
            : theme.palette.text.secondary,
        }}
      >
        {icon}
      </Box>
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        {label}
      </Typography>
    </MenuItem>
  );
};

export default function ProfileMenu() {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [, setIsLoading] = useState(false);

  const userInfo = useSelector((state: RootState) => state?.auth?.loginUser);
  const myId = userInfo?.id;

  useEffect(() => {
    if (!userInfo?.id) {
      checkAuthRes(dispatch, setIsLoading);
    }
  }, [dispatch, userInfo?.id]);

  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(CURRENT_PATH_KEY);
    disconnectSocket();
    navigate("/login");
  };

  const handleMenu = (target: string) => {
    handleCloseUserMenu();
    switch (target) {
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
        break;
    }
  };

  const userAvatarSrc = userInfo?.img || userInfo?.profileImage || "";

  return (
    <Box sx={{ flexGrow: 0 }}>
      <Tooltip title="Account Settings">
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0.5 }}>
          {userAvatarSrc ? (
            <Avatar
              src={userAvatarSrc}
              alt={userInfo?.name || "User"}
              sx={{ width: 40, height: 40 }}
            />
          ) : (
            <Avatar
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                width: 40,
                height: 40,
                fontWeight: 600,
              }}
            >
              {userInfo?.name?.slice(0, 1).toUpperCase() || "U"}
            </Avatar>
          )}
        </IconButton>
      </Tooltip>

      <Menu
        id="menu-appbar"
        anchorEl={anchorElUser}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              minWidth: 260,
              mt: 1.5,
              p: 1,
              borderRadius: 3,
              backgroundColor: alpha(theme.palette.background.paper, 0.95),
              backdropFilter: "blur(12px)",
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.12)}`,
            },
          },
        }}
      >
        {/* User Card Header */}
        <Stack
          direction="column"
          spacing={1}
          sx={{
            pt: 1,
            pb: 2,
            px: 2,
            textAlign: "center",
            alignItems: "center",
          }}
        >
          {userAvatarSrc ? (
            <Avatar
              src={userAvatarSrc}
              alt={userInfo?.name}
              sx={{ width: 56, height: 56 }}
            />
          ) : (
            <Avatar
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                width: 56,
                height: 56,
                fontSize: "1.5rem",
                fontWeight: 600,
              }}
            >
              {userInfo?.name?.slice(0, 1).toUpperCase() || "U"}
            </Avatar>
          )}

          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              {userInfo?.name || "User"}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.text.secondary,
                wordBreak: "break-all",
              }}
            >
              {userInfo?.email || ""}
            </Typography>
          </Box>

          <Button
            fullWidth
            variant="contained"
            size="small"
            disableElevation
            onClick={() => handleMenu("dashboard")}
            sx={{
              mt: 1,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Dashboard
          </Button>
        </Stack>

        <Divider sx={{ my: 1, borderColor: theme.palette.divider }} />

        {/* Menu Items */}
        <ProfileMenuItem
          onClick={() => handleMenu("profile")}
          label="Profile"
          icon={<AccountCircleOutlinedIcon fontSize="small" />}
        />

        {!userInfo?.google_login && (
          <ProfileMenuItem
            onClick={() => handleMenu("changePassword")}
            label="Change Password"
            icon={<LockResetOutlinedIcon fontSize="small" />}
          />
        )}

        <ProfileMenuItem
          onClick={() => handleMenu("inviteUser")}
          label="Invite User"
          icon={<PersonAddIcon fontSize="small" />}
        />

        <ProfileMenuItem
          onClick={() => handleMenu("manageUser")}
          label="Manage Users"
          icon={<ManageAccountsOutlinedIcon fontSize="small" />}
        />

        <Divider sx={{ my: 1, borderColor: theme.palette.divider }} />

        <ProfileMenuItem
          onClick={() => handleMenu("logout")}
          label="Log Out"
          isDanger
          icon={<LogoutIcon fontSize="small" />}
        />
      </Menu>
    </Box>
  );
}
