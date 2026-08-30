/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  DashboardCustomizeRounded,
  PersonRounded,
  LockResetRounded,
  PersonAddRounded,
  ManageAccountsRounded,
  LogoutRounded,
} from "@mui/icons-material";
import type { RootState } from "../../redux/store";
import ConfirmModal from "../ui/ConfirmModal";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

export interface ProfileMenuProps {
  anchorEl?: any;
  open?: boolean;
  onClose?: () => void;
  onLogout?: () => void;
}

interface MenuItemDef {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  destructive?: boolean;
}

const ProfileMenu = ({ anchorEl, open, onClose, onLogout }: ProfileMenuProps) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loginUser } = useSelector((state: RootState) => state?.auth);

  const [localAnchor, setLocalAnchor] = useState<null | HTMLElement>(null);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const anchor = anchorEl ?? localAnchor;
  const isOpen = open ?? Boolean(anchor);
  const handleClose = () => {
    onClose?.();
    setLocalAnchor(null);
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      sessionStorage.clear();
      dispatch({ type: "auth/logout" });
      handleClose();
      setConfirmLogout(false);
      onLogout?.();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const userId = loginUser?.id || "";

  const items: MenuItemDef[] = [
    { label: "Dashboard", icon: <DashboardCustomizeRounded fontSize="small" />, onClick: () => navigate("/") },
    { label: "Profile", icon: <PersonRounded fontSize="small" />, onClick: () => navigate(userId ? `/profile/${userId}` : "/") },
    { label: "Change Password", icon: <LockResetRounded fontSize="small" />, onClick: () => navigate("/update-password") },
    { label: "Invite User", icon: <PersonAddRounded fontSize="small" />, onClick: () => navigate("/inviteUser") },
    { label: "Manage Users", icon: <ManageAccountsRounded fontSize="small" />, onClick: () => navigate("/manageUser") },
  ];

  return (
    <>
      <Menu
        id="profile-menu"
        anchorEl={anchor}
        keepMounted
        open={isOpen}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          list: { "aria-labelledby": "profile-menu-button" },
          paper: {
            elevation: 0,
            sx: {
              minWidth: 260,
              borderRadius: 3,
              py: 1.5,
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: `0 20px 40px ${alpha(theme.palette.common.black, 0.12)}`,
              mt: 0.5,
            },
          },
        }}
      >
        <Box sx={{ px: 2, pb: 1.5, display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar
            src={loginUser?.img ? `data:image/jpeg;base64,${loginUser.img}` : ""}
            sx={{ width: 48, height: 48, border: `2px solid ${theme.palette.divider}` }}
          >
            {loginUser?.name?.[0]?.toUpperCase() || ""}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle1" noWrap sx={{ fontWeight: 700 }}>
              {loginUser?.name || "User"}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap title={loginUser?.email}>
              {loginUser?.email || ""}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 1 }} />

        {items.map((item) => (
          <MenuItem
            key={item.label}
            onClick={() => { handleClose(); item.onClick(); }}
            sx={{
              mx: 1.25,
              borderRadius: 2,
              pr: 1.5,
              "&:focus-visible": { outline: `2px solid ${theme.palette.primary.main}`, outlineOffset: 2 },
            }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label} slotProps={{ primary: { variant: "body2", color: "inherit" } }} />
          </MenuItem>
        ))}

        <Divider sx={{ my: 1 }} />

        <MenuItem
          onClick={() => setConfirmLogout(true)}
          sx={{
            mx: 1.25,
            mb: 0.5,
            borderRadius: 2,
            pr: 1.5,
            color: theme.palette.error.main,
            "&:hover": { backgroundColor: alpha(theme.palette.error.main, 0.08) },
            "&:focus-visible": { outline: `2px solid ${theme.palette.error.main}`, outlineOffset: 2 },
          }}
        >
          <ListItemIcon sx={{ minWidth: 36, color: theme.palette.error.main }}>
            <LogoutRounded fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Logout" slotProps={{ primary: { variant: "body2", color: "inherit" } }} />
        </MenuItem>
      </Menu>

      <ConfirmModal
        open={confirmLogout}
        onClose={() => setConfirmLogout(false)}
        onConfirm={handleLogout}
        title="Log out of Chatty?"
        description="You will be signed out and returned to the login screen. Your conversations will be waiting when you come back."
        confirmText="Log out"
        cancelText="Cancel"
        danger
        icon={<LogoutRoundedIcon sx={{ fontSize: 28 }} />}
      />
    </>
  );
};

export default ProfileMenu;
