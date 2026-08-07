import { ReactNode, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { alpha, useTheme } from "@mui/material/styles";

import { DRAWER_WIDTH, NAV_BAR_HEIGHT } from "../../constants/common";
import { RootState } from "../../redux/store";
import { TUser } from "../../types";
import { StyledBadge } from "../../components/StyledBadge";
import ProfileMenu from "../../components/ProfileMenu/ProfileMenu";
import logoImage from "../../assets/logo.png";
import { SET_RIGHT_SIDEBAR_OPEN_STATUS } from "../../redux/features/chat/conversationSlice";

interface NavBarProps {
  children?: ReactNode;
  isDrawer?: boolean;
}

const NavBar = ({ children, isDrawer = false }: NavBarProps) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { receiverId } = useSelector((state: RootState) => state?.message);
  const { allUsers, activeUsers = [] } = useSelector(
    (state: RootState) => state?.auth,
  );

  const selectedUserInfo = useMemo(() => {
    if (allUsers?.length > 0 && receiverId) {
      return allUsers.find((u: TUser) => u?.id === receiverId);
    }
    return null;
  }, [allUsers, receiverId]);

  const userAvatarSrc = selectedUserInfo?.img
    ? selectedUserInfo.img.startsWith("data:")
      ? selectedUserInfo.img
      : `data:image/jpeg;base64,${selectedUserInfo.img}`
    : "";

  const isOnline = activeUsers?.includes(
    selectedUserInfo?.id?.toString() || "",
  );

  const renderAvatar = () => {
    if (userAvatarSrc) {
      return (
        <Avatar
          src={userAvatarSrc}
          alt={selectedUserInfo?.name || "User Avatar"}
          sx={{ width: 40, height: 40 }}
        />
      );
    }

    return (
      <Avatar
        sx={{
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          width: 40,
          height: 40,
          fontWeight: 600,
        }}
      >
        {selectedUserInfo?.name?.slice(0, 2).toUpperCase() || "U"}
      </Avatar>
    );
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: isDrawer ? `calc(100% - ${DRAWER_WIDTH}px)` : "100%" },
          ml: { sm: isDrawer ? `${DRAWER_WIDTH}px` : 0 },
          backgroundColor: alpha(theme.palette.background.paper, 0.85),
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${theme.palette.divider}`,
          color: theme.palette.text.primary,
          height: NAV_BAR_HEIGHT,
          px: { xs: 2, sm: 4 },
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            height: "100%",
          }}
        >
          {isDrawer && selectedUserInfo ? (
            <Stack
              direction="row"
              spacing={1.5}
              onClick={() => dispatch(SET_RIGHT_SIDEBAR_OPEN_STATUS(true))}
              sx={{
                alignItems: "center",
                cursor: "pointer",
                p: 0.75,
                borderRadius: 2,
                transition: "background-color 0.2s ease",
                "&:hover": {
                  backgroundColor: alpha(theme.palette.action.hover, 0.08),
                },
              }}
            >
              {isOnline ? (
                <StyledBadge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  variant="dot"
                >
                  {renderAvatar()}
                </StyledBadge>
              ) : (
                renderAvatar()
              )}

              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                }}
              >
                {selectedUserInfo?.name}
              </Typography>
            </Stack>
          ) : (
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
              <Avatar
                onClick={() => navigate("/")}
                alt="logo"
                src={logoImage}
                sx={{
                  width: 38,
                  height: 38,
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
          )}

          <ProfileMenu />
        </Stack>
      </AppBar>

      <Box sx={{ mt: `${NAV_BAR_HEIGHT}` }}>{children}</Box>
    </>
  );
};

export default NavBar;
