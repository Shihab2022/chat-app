/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import logoImage from "../assets/logo.png";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { acceptInviteApi } from "../services/auth";
import { useDispatch } from "react-redux";
import {
  SET_CONVERSATION,
  SET_RECEIVER_ID,
} from "../redux/features/chat/conversationSlice";
import { groupMessagesByDate } from "../utils/timeFormat";
import { ACCESS_TOKEN_KEY, SENDING_FAILED_MESSAGE } from "../constants/common";
import {
  CircularProgress,
  Grid,
  Link,
  Paper,
  Stack,
  alpha,
  useTheme,
} from "@mui/material";

export default function AcceptInvite() {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { search } = useLocation();
  const urlSearchParams = new URLSearchParams(search);
  const token = urlSearchParams.get("token");

  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    mode: "onBlur",
  });

  const onSubmit = async (data: any) => {
    try {
      const params = {
        token,
        ...data,
      };
      const response = await acceptInviteApi(params);
      if (response?.data?.accessToken) {
        const { accessToken: token, data, mess } = response?.data;
        dispatch(SET_RECEIVER_ID(data?.sender_id));
        const formattedMessage = groupMessagesByDate(mess);
        dispatch(SET_CONVERSATION(formattedMessage));
        localStorage.setItem(ACCESS_TOKEN_KEY, token);
        navigate("/chat");
        reset();
      }
    } catch (error) {
      console.error(SENDING_FAILED_MESSAGE, error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `radial-gradient(circle at 50% 0%, ${alpha(
          theme.palette.primary.main,
          0.15,
        )} 0%, ${theme.palette.background.default} 70%)`,
        py: 4,
      }}
    >
      <Container component="main" maxWidth="sm">
        <CssBaseline />
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
          {/* Logo & Header */}
          <Avatar
            onClick={() => navigate("/")}
            alt="logo"
            src={logoImage}
            sx={{
              width: 64,
              height: 64,
              mb: 1.5,
              cursor: "pointer",
              transition: "transform 0.2s ease-in-out",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          />
          <Typography
            component="h1"
            variant="h5"
            sx={{ fontWeight: 700, letterSpacing: "-0.5px" }}
          >
            Accept Invitation
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 3, textAlign: "center" }}
          >
            Complete your profile details below to join the conversation
          </Typography>

          {/* Form */}
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{ width: "100%" }}
          >
            <Grid container spacing={2}>
              {/* First Name Field */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="firstname"
                  label="First Name"
                  {...register("firstname", {
                    required: "First Name is required",
                  })}
                  error={!!errors.firstname}
                  helperText={
                    typeof errors.firstname?.message === "string"
                      ? errors.firstname.message
                      : ""
                  }
                />
              </Grid>

              {/* Last Name Field */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="lastname"
                  label="Last Name"
                  {...register("lastname", {
                    required: "Last Name is required",
                  })}
                  error={!!errors.lastname}
                  helperText={
                    typeof errors.lastname?.message === "string"
                      ? errors.lastname.message
                      : ""
                  }
                />
              </Grid>

              {/* Password Field */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  error={!!errors.password}
                  helperText={
                    typeof errors.password?.message === "string"
                      ? errors.password.message
                      : ""
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={toggleShowPassword}
                          edge="end"
                          aria-label="toggle password visibility"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isSubmitting}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.4,
                borderRadius: 2,
                fontSize: "1rem",
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
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Join Conversation"
              )}
            </Button>

            {/* Back to Login Link */}
            <Stack
              direction="row"
              spacing={0.5}
              justifyContent="center"
              alignItems="center"
              sx={{ mt: 2 }}
            >
              <Link
                component={RouterLink}
                to="/login"
                variant="body2"
                color="primary"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.5,
                  fontWeight: 600,
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                <ArrowBackIcon fontSize="small" /> Back to Sign In
              </Link>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
