import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import { DRAWER_WIDTH, NAV_BAR_HEIGHT } from "../../constants/common";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useMemo } from "react";
import { TUser } from "../../types";
import { Avatar, Stack } from "@mui/material";
import { StyledBadge } from "../../components/StyledBadge";
import ProfileMenu from "../../components/ProfileMenu/ProfileMenu";

const NavBar = () => {
  const { receiverId } = useSelector((state: RootState) => state?.message);
  const { allUsers, activeUsers = [] } = useSelector(
    (state: RootState) => state?.auth
  );
  const selectedUserInfo = useMemo(() => {
    if (allUsers?.length > 0 && receiverId) {
      const user = allUsers.find((u: TUser) => u?._id === receiverId);
      return user;
    }
  }, [receiverId]);
  return (
    <>
      <AppBar
        position="fixed"
        elevation={1}
        sx={{
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { sm: `${DRAWER_WIDTH}px` },
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
          <Stack
            direction="row"
            spacing={2}
            sx={{
              justifyContent: "flex-start",
              alignItems: "center",
              height: "100%",
              color: "#000",
            }}
          >
            {activeUsers?.includes(selectedUserInfo?._id) ? (
              <Stack direction="row" spacing={2}>
                <StyledBadge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  variant="dot"
                >
                  <Avatar
                    alt={selectedUserInfo?.name}
                    src={selectedUserInfo?.img}
                  />
                </StyledBadge>
              </Stack>
            ) : (
              <Avatar
                alt={selectedUserInfo?.name}
                src={selectedUserInfo?.img}
              />
            )}

            <Typography component="div" variant="h6">
              {selectedUserInfo?.name}
            </Typography>
          </Stack>

          <ProfileMenu user={{}} />
        </Stack>
      </AppBar>
    </>
  );
};

export default NavBar;
