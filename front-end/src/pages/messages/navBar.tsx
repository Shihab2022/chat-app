import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppBar, Avatar, Box, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import { NAV_BAR_HEIGHT } from "../../constants/common";
import { RootState } from "../../redux/store";
import type { TUser } from "../../types";
import UserAvatar from "../../components/ui/UserAvatar";
import OnlineIndicator from "../../components/ui/OnlineIndicator";

interface NavBarProps {
  /** Optional page content. When provided, NavBar renders a top bar + content layout (e.g. Manage Users, Profile). */
  children?: React.ReactNode;
  /** Legacy flag kept for route compatibility — no visual effect. */
  isDrawer?: boolean;
  showBack?: boolean;
  onBack?: () => void;
  profileSidebarOpen?: boolean;
  toggleProfileSidebar?: () => void;
}

const NavBar = ({
  children,
  isDrawer = false,
  showBack = false,
  onBack,
  profileSidebarOpen = false,
  toggleProfileSidebar,
}: NavBarProps) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { receiverId } = useSelector((state: RootState) => state?.message);
  const { allUsers = [], activeUsers = [], loginUser } = useSelector((state: RootState) => state?.auth);
  void loginUser;

  const selectedUserInfo = useMemo(() => {
    if (allUsers?.length > 0 && receiverId) {
      return allUsers.find((u: TUser) => String(u.id) === String(receiverId));
    }
    return null;
  }, [allUsers, receiverId]);

  const userAvatarSrc = selectedUserInfo?.img
    ? selectedUserInfo.img.startsWith("data:")
      ? selectedUserInfo.img
      : `data:image/jpeg;base64,${selectedUserInfo.img}`
    : "";

  const isOnline = activeUsers?.includes(selectedUserInfo?.id?.toString() || "");
  const displayName = selectedUserInfo?.name || "Chatty";
  const isGroup = !!selectedUserInfo?.isGroup;
  const memberCount =
    selectedUserInfo?.members?.length || selectedUserInfo?.participants?.length || 0;
  void dispatch;

  const handleToggleInfo = () => {
    if (toggleProfileSidebar) {
      toggleProfileSidebar();
    } else {
      dispatch({ type: "message/setRightSidebarOpenStatus", payload: !profileSidebarOpen });
    }
  };

  // Chat dashboard renders its own header internally — just pass children through.
  if (isDrawer) return <>{children}</>;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100dvh" }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          width: "100%",
          backgroundColor: alpha(theme.palette.background.paper, 0.85),
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${theme.palette.divider}`,
          color: theme.palette.text.primary,
          height: NAV_BAR_HEIGHT,
          px: { xs: 1.5, sm: 2.5 },
          zIndex: theme.zIndex.appBar,
      }}
    >
      <Stack
        direction="row"
        sx={{ justifyContent: "space-between", alignItems: "center", height: "100%" }}
      >
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", minWidth: 0 }}>
          {showBack && (
            <Tooltip title="Back" arrow>
              <IconButton
                onClick={onBack}
                size="small"
                sx={{
                  color: theme.palette.text.secondary,
                  borderColor: theme.palette.divider,
                  borderRadius: 1.5,
                  "&:hover": { backgroundColor: theme.palette.action.hover },
                }}
              >
                <ArrowBackIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}

          {selectedUserInfo ? (
            <>
              <UserAvatar
                img={userAvatarSrc}
                name={displayName}
                size={40}
                isGroup={isGroup}
                isOnline={isOnline}
              />
              <Box sx={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                    lineHeight: 1.2,
                    maxWidth: 180,
                  }}
                >
                  {displayName}
                </Typography>
                {isGroup ? (
                  <Typography variant="caption" sx={{ color: theme.palette.text.secondary, lineHeight: 1.2 }}>
                    {memberCount} {memberCount === 1 ? "member" : "members"}
                  </Typography>
                ) : (
                  <OnlineIndicator online={isOnline} size="small" />
                )}
              </Box>
            </>
          ) : (
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
              <Avatar
                onClick={() => navigate("/")}
                alt="Chatty logo"
                src="/logo.png"
                sx={{ width: 36, height: 36, cursor: "pointer", borderRadius: 1.5 }}
              />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Chatty
              </Typography>
            </Stack>
          )}
        </Stack>

        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          {selectedUserInfo && (
            <Tooltip title="Chat info" arrow>
              <IconButton
                onClick={handleToggleInfo}
                size="small"
                aria-label="toggle chat information"
                sx={{
                  color: theme.palette.text.secondary,
                  borderRadius: 1.5,
                  "&:hover": { backgroundColor: theme.palette.action.hover },
                }}
              >
                <InfoRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      </Stack>
    </AppBar>

      {children && (
        <Box component="main" sx={{ flex: 1, minWidth: 0 }}>
          {children}
        </Box>
      )}
    </Box>
  );
}

export default NavBar;
