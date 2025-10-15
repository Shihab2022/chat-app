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
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import InputAdornment from "@mui/material/InputAdornment/InputAdornment";
import IconButton from "@mui/material/IconButton/IconButton";
import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { updatePasswordApi } from "../services/auth";

const defaultTheme = createTheme();

export default function UpdatePassword() {
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => setShowPassword((prev) => !prev);
  const [confirmShowPassword, setConfirmShowPassword] = useState(false);
  const toggleConfirmShowPassword = () =>
    setConfirmShowPassword((prev) => !prev);
  const navigate = useNavigate();
  const { search } = useLocation();
  const urlSearchParams = new URLSearchParams(search);
  const token = urlSearchParams.get("token"); //we send token on the backend the check token and send email to the front end
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm({
    mode: "onBlur", // validate on blur
  });
  const onSubmit = async (data: any) => {
    try {
      const params = {
        token,
        ...data,
      };
      const response = await updatePasswordApi(params);
      console.log({ response });
      if (response?.success) {
        // navigate("/login");
        reset();
      }
    } catch (error) {
      console.error("❌ Error sending invite:", error);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar
            onClick={() => navigate("/")}
            alt="logo"
            src={logoImage}
            sx={{ width: 70, height: 70, mb: 2, cursor: "pointer" }}
          />
          <Typography component="h1" variant="h5">
            Join With Your Friend
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{ mt: 1 }}
          >
            {/* Email Field */}
            <TextField
              margin="normal"
              fullWidth
              id="pin"
              label="Pin"
              {...register("pin", {
                required: "Pin is required",
              })}
              error={!!errors.pin}
              helperText={
                typeof errors.pin?.message === "string"
                  ? errors.pin.message
                  : ""
              }
            />
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
              //   helperText={errors.password?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={toggleShowPassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {/* Confirm Password Field */}
            <TextField
              margin="normal"
              fullWidth
              id="confirmPassword"
              label="Confirm Password"
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
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={toggleConfirmShowPassword} edge="end">
                      {confirmShowPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isSubmitting}
              sx={{ mt: 3, mb: 2 }}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
