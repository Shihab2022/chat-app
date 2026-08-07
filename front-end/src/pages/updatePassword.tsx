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
import { updatePasswordApi } from "../services/auth";
import { SENDING_FAILED_MESSAGE } from "../constants/common";
import { CircularProgress, Link, Paper, Stack } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
export default function UpdatePassword() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { search } = useLocation();
  const urlSearchParams = new URLSearchParams(search);
  const token = urlSearchParams.get("token");

  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  const [confirmShowPassword, setConfirmShowPassword] = useState(false);
  const toggleConfirmShowPassword = () =>
    setConfirmShowPassword((prev) => !prev);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm({
    mode: "onBlur",
  });

  const onSubmit = async (data: any) => {
    try {
      const params = {
        token,
        ...data,
      };
      const response = await updatePasswordApi(params);
      if (response?.success) {
        navigate("/login");
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
            Reset Password
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 3, textAlign: "center" }}
          >
            Enter your PIN and set a new password to secure your account.
          </Typography>

          {/* Form */}
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{ width: "100%" }}
          >
            {/* PIN Field */}
            <TextField
              margin="normal"
              fullWidth
              id="pin"
              label="Reset PIN"
              {...register("pin", {
                required: "PIN is required",
              })}
              error={!!errors.pin}
              helperText={
                typeof errors.pin?.message === "string"
                  ? errors.pin.message
                  : ""
              }
            />

            {/* Password Field */}
            <TextField
              margin="normal"
              fullWidth
              label="New Password"
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
              slotProps={{
                input: {
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
                },
              }}
            />

            {/* Confirm Password Field */}
            <TextField
              margin="normal"
              fullWidth
              id="confirmPassword"
              label="Confirm New Password"
              type={confirmShowPassword ? "text" : "password"}
              {...register("confirmPassword", {
                required: "Confirm Password is required",
                validate: (value) =>
                  value === watch("password") || "Passwords do not match",
              })}
              error={!!errors.confirmPassword}
              helperText={
                typeof errors.confirmPassword?.message === "string"
                  ? errors.confirmPassword.message
                  : ""
              }
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={toggleConfirmShowPassword}
                        edge="end"
                        aria-label="toggle confirm password visibility"
                      >
                        {confirmShowPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

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
                "Update Password"
              )}
            </Button>

            {/* Back to Login Link */}
            <Stack
              direction="row"
              spacing={0.5}
  
              sx={{ mt: 2 ,alignItems: "center", justifyContent: "center"}}
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
