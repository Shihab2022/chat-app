/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Avatar,
  Typography,
  Container,
  Grid,
  Box,
  TextField,
  Button,
  Paper,
  Divider,
  CircularProgress,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { updateUserInfoAPI } from "../services/auth";
import { useState } from "react";
import { setUser } from "../redux/features/auth/authSlice";
import { showToast } from "../utils/toast";
import { COMMON_ERROR_MESSAGE, SUCCESS, WARNING } from "../constants/common";

export default function Profile() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { loginUser } = useSelector((state: RootState) => state?.auth);

  const [isLoading, setIsLoading] = useState(false);
  const { img, email, name, bio } = loginUser || {};

  const [userName, setUserName] = useState(name || "");
  const [userBio, setUserBio] = useState(bio || "");

  const updateUserData = async () => {
    try {
      setIsLoading(true);
      const res = await updateUserInfoAPI({
        name: userName,
        bio: userBio,
      });

      if (res?.success) {
        const resData = res?.data;
        dispatch(setUser(resData));
        showToast(SUCCESS, "Profile updated successfully!");
      }
    } catch (e) {
      showToast(WARNING, COMMON_ERROR_MESSAGE);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `radial-gradient(circle at 50% 0%, ${alpha(
          theme.palette.primary.main,
          0.12,
        )} 0%, ${theme.palette.background.default} 70%)`,
        py: 6,
      }}
    >
      <Container maxWidth="md">
        <Grid container spacing={4}>
          {/* Profile Overview Card */}
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                borderRadius: 4,
                border: `1px solid ${theme.palette.divider}`,
                backdropFilter: "blur(10px)",
                backgroundColor: alpha(theme.palette.background.paper, 0.8),
                boxShadow: `0 8px 32px 0 ${alpha(
                  theme.palette.common.black,
                  0.08,
                )}`,
              }}
            >
              <Avatar
                alt={name}
                src={img}
                sx={{
                  width: 120,
                  height: 120,
                  mb: 2,
                  boxShadow: `0 4px 14px ${alpha(
                    theme.palette.primary.main,
                    0.25,
                  )}`,
                  border: `3px solid ${theme.palette.background.paper}`,
                }}
              />
              <Typography
                variant="h6"
                component="div"
                sx={{
                  fontWeight: 700,
                  letterSpacing: "-0.5px",
                  textAlign: "center",
                }}
              >
                {name || "User Name"}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 2, textAlign: "center" }}
              >
                {email || "user@example.com"}
              </Typography>
            </Paper>
          </Grid>

          {/* Edit Profile Form Card */}
          <Grid item xs={12} md={8}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 4,
                border: `1px solid ${theme.palette.divider}`,
                backdropFilter: "blur(10px)",
                backgroundColor: alpha(theme.palette.background.paper, 0.8),
                boxShadow: `0 8px 32px 0 ${alpha(
                  theme.palette.common.black,
                  0.08,
                )}`,
              }}
            >
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <EditIcon color="primary" />
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, letterSpacing: "-0.5px" }}
                >
                  Edit Profile
                </Typography>
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Update your account details and public information.
              </Typography>

              <Divider sx={{ mb: 3 }} />

              <Box component="form" noValidate sx={{ width: "100%" }}>
                <TextField
                  label="Display Name"
                  variant="outlined"
                  fullWidth
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  sx={{ mb: 3 }}
                />

                <TextField
                  label="Bio"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
                  value={userBio}
                  onChange={(e) => setUserBio(e.target.value)}
                  sx={{ mb: 3 }}
                />

                <Button
                  variant="contained"
                  color="primary"
                  onClick={updateUserData}
                  disabled={isLoading}
                  startIcon={
                    isLoading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <SaveIcon />
                    )
                  }
                  sx={{
                    py: 1.2,
                    px: 3,
                    borderRadius: 2,
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    textTransform: "none",
                    boxShadow: `0 4px 12px ${alpha(
                      theme.palette.primary.main,
                      0.3,
                    )}`,
                    "&:hover": {
                      boxShadow: `0 6px 16px ${alpha(
                        theme.palette.primary.main,
                        0.4,
                      )}`,
                    },
                  }}
                >
                  {isLoading ? "Saving Changes..." : "Save Changes"}
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
