/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff, ArrowForwardRounded } from "@mui/icons-material";
import { useForm, SubmitHandler } from "react-hook-form";
import { COMMON_ERROR_MESSAGE, FAILED, REGISTER_SUCCESS, SUCCESS } from "../../constants/common";
import { showToast } from "../../utils/toast";
import { googleRegisterApi, registerUserApi } from "../../services/auth";
import AuthLayout from "../../components/ui/AuthLayout";
import GoogleLoginCom from "./googleLoginCom";

interface SignUpFormInputs {
  userName: string;
  name: string;
  email: string;
  password: string;
}

export default function SignUp() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormInputs>({
    defaultValues: { userName: "", name: "", email: "", password: "" },
  });

  const onSubmit: SubmitHandler<SignUpFormInputs> = async (data) => {
    try {
      setIsLoading(true);
      const res = await registerUserApi(data);
      if (res?.success) {
        showToast(SUCCESS, REGISTER_SUCCESS);
        navigate("/login");
      }
    } catch (error) {
      showToast(FAILED, COMMON_ERROR_MESSAGE);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (params: any) => {
    try {
      setIsLoading(true);
      await googleRegisterApi(params);
    } catch (error) {
      showToast(FAILED, COMMON_ERROR_MESSAGE);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start your 14-day free trial. No credit card required."
    >
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ width: "100%" }}>
        <TextField
          fullWidth
          margin="normal"
          label="Username"
          autoComplete="username"
          {...register("userName", {
            required: "Username is required",
            minLength: { value: 3, message: "At least 3 characters" },
          })}
          error={!!errors.userName}
          helperText={errors.userName?.message || " "}
          sx={{ mb: 0.5 }}
        />

        <TextField
          fullWidth
          margin="normal"
          label="Full name"
          autoComplete="name"
          {...register("name", { required: "Full name is required" })}
          error={!!errors.name}
          helperText={errors.name?.message || " "}
          sx={{ mb: 0.5 }}
        />

        <TextField
          fullWidth
          margin="normal"
          label="Email address"
          type="email"
          autoComplete="email"
          {...register("email", {
            required: "Email is required",
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email address" },
          })}
          error={!!errors.email}
          helperText={errors.email?.message || " "}
          sx={{ mb: 0.5 }}
        />

        <TextField
          fullWidth
          margin="normal"
          label="Password"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          {...register("password", {
            required: "Password is required",
            minLength: { value: 6, message: "Password must be at least 6 characters" },
          })}
          error={!!errors.password}
          helperText={errors.password?.message || " "}
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
          sx={{ mb: 0.5 }}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={isLoading}
          endIcon={isLoading ? undefined : <ArrowForwardRounded />}
          sx={{ mt: 1.5, py: 1.5 }}
        >
          {isLoading ? <CircularProgress size={22} color="inherit" /> : "Sign Up"}
        </Button>

        <Divider sx={{ my: 3 }}>
          <Typography variant="caption" color="text.disabled" sx={{ px: 1.5 }}>
            OR
          </Typography>
        </Divider>

        <GoogleLoginCom handleClick={handleRegister} />

        <Stack
          direction="row"
          spacing={0.75}
          sx={{ mt: 3, justifyContent: "center", alignItems: "center" }}
        >
          <Typography variant="body2" color="text.secondary">
            Already have an account?
          </Typography>
          <Link
            component={RouterLink}
            to="/login"
            variant="body2"
            sx={{
              color: "primary.main",
              fontWeight: 700,
              textDecoration: "none",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Sign In
          </Link>
        </Stack>
      </Box>
    </AuthLayout>
  );
}
