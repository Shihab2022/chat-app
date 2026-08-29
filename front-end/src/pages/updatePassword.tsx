/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
} from "@mui/material";
import { Visibility, VisibilityOff, ArrowForwardRounded } from "@mui/icons-material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useForm, SubmitHandler } from "react-hook-form";
import { updatePasswordApi } from "../services/auth";
import { SENDING_FAILED_MESSAGE } from "../constants/common";
import AuthLayout from "../components/ui/AuthLayout";

interface UpdatePasswordForm {
  password: string;
  confirmPassword: string;
}

export default function UpdatePassword() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const urlSearchParams = new URLSearchParams(search);
  const token = urlSearchParams.get("token");

  const [showPassword, setShowPassword] = useState(false);
  const [confirmShowPassword, setConfirmShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<UpdatePasswordForm>({ mode: "onBlur" });

  const onSubmit: SubmitHandler<UpdatePasswordForm> = async (data) => {
    try {
      const params = { token, ...data };
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
    <AuthLayout
      title="Update Password"
      subtitle="Set a new password for your account. Make sure it's secure."
    >
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ width: "100%" }}>
        <TextField
          fullWidth
          required
          id="password"
          label="New Password"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          {...register("password", {
            required: "Password is required",
            minLength: { value: 6, message: "Password must be at least 6 characters" },
          })}
          error={!!errors.password}
          helperText={typeof errors.password?.message === "string" ? errors.password.message : ""}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)}
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

        <TextField
          margin="normal"
          fullWidth
          required
          id="confirmPassword"
          label="Confirm New Password"
          type={confirmShowPassword ? "text" : "password"}
          autoComplete="new-password"
          {...register("confirmPassword", {
            required: "Confirm Password is required",
            validate: (value) => value === watch("password") || "Passwords do not match",
          })}
          error={!!errors.confirmPassword}
          helperText={
            typeof errors.confirmPassword?.message === "string" ? errors.confirmPassword.message : ""
          }
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setConfirmShowPassword((prev) => !prev)}
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

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={isSubmitting}
          endIcon={isSubmitting ? undefined : <ArrowForwardRounded />}
          sx={{ mt: 1.5, py: 1.5 }}
        >
          {isSubmitting ? <CircularProgress size={22} color="inherit" /> : "Update Password"}
        </Button>

        <Stack direction="row" sx={{ mt: 3, justifyContent: "center", alignItems: "center" }}>
          <Link
            component={RouterLink}
            to="/login"
            variant="body2"
            sx={{
              color: "primary.light",
              fontWeight: 600,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 0.6,
              "&:hover": { textDecoration: "underline" },
            }}
          >
            <ArrowBackIcon fontSize="small" /> Back to Sign In
          </Link>
        </Stack>
      </Box>
    </AuthLayout>
  );
}
