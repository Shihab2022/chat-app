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
import { LOGIN_SUCCESS, SUCCESS } from "../../constants/common";
import { showToast } from "../../utils/toast";
import { useAppDispatch } from "../../redux/hooks";
import { setUser } from "../../redux/features/auth/authSlice";
import { setToken } from "../../utils/auth";
import { googleLoginApi, loginUserApi } from "../../services/auth";
import { SignInFormInputs } from "../../types";
import { connectSocket } from "../../utils/socketService";
import GoogleLoginCom from "./googleLoginCom";
import AuthLayout from "../../components/ui/AuthLayout";

export default function SignIn() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormInputs>({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit: SubmitHandler<SignInFormInputs> = async (data) => {
    try {
      setIsLoading(true);
      const res = await loginUserApi(data);
      if (res?.success) {
        const accessToken = res?.data?.accessToken;
        const userData = res?.data?.data;
        const userId = res?.data?.data?.id;
        connectSocket(userId, dispatch);
        setToken(accessToken);
        showToast(SUCCESS, LOGIN_SUCCESS);
        dispatch(setUser(userData));
        navigate("/chat");
      }
    } catch (error) {
      console.log({ error });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (params: any) => {
    try {
      await googleLoginApi(params);
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue your conversations with friends and teams."
    >
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        sx={{ width: "100%" }}
      >
        <TextField
          fullWidth
          margin="normal"
          id="email"
          label="Email address"
          type="email"
          autoComplete="email"
          autoFocus
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter a valid email address",
            },
          })}
          error={!!errors.email}
          helperText={errors.email?.message || " "}
          sx={{ mb: 0.5 }}
        />

        <TextField
          fullWidth
          margin="normal"
          id="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
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

        <Stack direction="row" sx={{ justifyContent: "flex-end", mt: 0.5, mb: 2.5 }}>
                    <Link
            component={RouterLink}
            to="/forgetPassword"
            variant="body2"
            sx={{
              color: "primary.light",
              textDecoration: "none",
              fontWeight: 600,
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Forgot password?
          </Link>
        </Stack>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={isLoading}
          endIcon={isLoading ? undefined : <ArrowForwardRounded />}
          sx={{ py: 1.5 }}
        >
          {isLoading ? <CircularProgress size={22} color="inherit" /> : "Sign In"}
        </Button>

        <Divider sx={{ my: 3 }}>
          <Typography variant="caption" color="text.disabled" sx={{ px: 1.5 }}>
            OR
          </Typography>
        </Divider>

        <GoogleLoginCom handleClick={handleLogin} />

        <Stack
          direction="row"
          spacing={0.75}
          sx={{ mt: 3, justifyContent: "center", alignItems: "center" }}
        >
          <Typography variant="body2" color="text.secondary">
            Don't have an account?
          </Typography>
                    <Link
            component={RouterLink}
            to="/signUp"
            variant="body2"
            sx={{
              color: "primary.light",
              fontWeight: 700,
              textDecoration: "none",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Sign up
          </Link>
        </Stack>
      </Box>
    </AuthLayout>
  );
}
