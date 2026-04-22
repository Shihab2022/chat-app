/* eslint-disable @typescript-eslint/no-explicit-any */
import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import { DRAWER_WIDTH, NAV_BAR_HEIGHT } from "../../constants/common";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useMemo } from "react";
import { TUser } from "../../types";
import { Avatar, Box, Stack } from "@mui/material";
import { StyledBadge } from "../../components/StyledBadge";
import ProfileMenu from "../../components/ProfileMenu/ProfileMenu";
import { useNavigate } from "react-router-dom";
import logoImage from "../../assets/logo.png";
import { SET_RIGHT_SIDEBAR_OPEN_STATUS } from "../../redux/features/chat/conversationSlice";
const NavBar = (props: any) => {
  const { children, isDrawer = false } = props;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { receiverId } = useSelector((state: RootState) => state?.message);
  const { allUsers, activeUsers = [] } = useSelector(
    (state: RootState) => state?.auth,
  );
  const selectedUserInfo = useMemo(() => {
    if (allUsers?.length > 0 && receiverId) {
      const user = allUsers.find((u: TUser) => u?.id === receiverId);
      return user;
    }
  }, [receiverId]);

  const userImage = `data:image/jpeg;base64,${selectedUserInfo?.img}`;
  return (
    <>
      <AppBar
        position="fixed"
        elevation={1}
        sx={{
          width: { sm: isDrawer ? `calc(100% - ${DRAWER_WIDTH}px)` : "100%" },
          ml: { sm: isDrawer ? `${DRAWER_WIDTH}px` : 0 },
          backgroundColor: "#fff",
          height: NAV_BAR_HEIGHT,
          paddingX: "30px",
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            height: "100% ",
          }}
        >
          {isDrawer ? (
            <Stack
              direction="row"
              spacing={2}
              sx={{
                justifyContent: "flex-start",
                alignItems: "center",
                height: "100%",
                color: "#000",
                cursor: "pointer",
              }}
              onClick={() => dispatch(SET_RIGHT_SIDEBAR_OPEN_STATUS(true))}
            >
              {activeUsers?.includes(selectedUserInfo?.id?.toString()) ? (
                <Stack direction="row" spacing={2}>
                  <StyledBadge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    variant="dot"
                  >
                    {selectedUserInfo?.img ? (
                      <Avatar
                        src={
                          selectedUserInfo?.img
                            ? selectedUserInfo?.img
                            : userImage
                        }
                      />
                    ) : (
                      <Avatar
                        sx={{
                          background: "#7c4dff",
                          color: "white",
                          width: 40,
                          height: 40,
                        }}
                      >
                        {selectedUserInfo?.name?.slice(0, 2).toUpperCase()}
                      </Avatar>
                    )}
                  </StyledBadge>
                </Stack>
              ) : (
                <>
                  {selectedUserInfo?.img ? (
                    <Avatar
                      src={
                        selectedUserInfo?.img
                          ? selectedUserInfo?.img
                          : userImage
                      }
                    />
                  ) : (
                    <Avatar
                      sx={{
                        background: "#7c4dff",
                        color: "white",
                        width: 40,
                        height: 40,
                      }}
                    >
                      {selectedUserInfo?.name?.slice(0, 2).toUpperCase()}
                    </Avatar>
                  )}
                </>
              )}

              <Typography component="div" variant="h6">
                {selectedUserInfo?.name}
              </Typography>
            </Stack>
          ) : (
            <Avatar
              onClick={() => navigate("/")}
              alt={"logo"}
              src={logoImage}
              sx={{ width: 40, height: 40, mb: 2, cursor: "pointer" }}
            />
          )}

          <ProfileMenu user={{}} />
        </Stack>
      </AppBar>

      <Box sx={{ mt: 10 }}>{children}</Box>
    </>
  );
};

export default NavBar;
