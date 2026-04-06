/* eslint-disable @typescript-eslint/no-explicit-any */
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import logoImage from "../../assets/logo.png";

import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Link, useNavigate } from "react-router-dom";
import { LOGIN_SUCCESS, SUCCESS } from "../../constants/common";
import { showToast } from "../../utils/toast";
import Loader from "../../components/loader";
import { useAppDispatch } from "../../redux/hooks";
import { setUser } from "../../redux/features/auth/authSlice";
import { setToken } from "../../utils/auth";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import {
  Box,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { googleLoginApi, loginUserApi } from "../../services/auth";
import { SignInFormInputs } from "../../types";
import { connectSocket } from "../../utils/socketService";
import GoogleLoginCom from "./googleLoginCom";

export default function SignIn() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormInputs>({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit: SubmitHandler<SignInFormInputs> = async (data) => {
    try {
      setIsLoading(true);
      const res = await loginUserApi(data);
      if (res?.success) {
        const accessToken = res?.data?.accessToken;
        const userData = res?.data?.data;
        const userId = res?.data?.data?.id;
        connectSocket(userId, dispatch); // ✅ Connect after login success
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
    <>
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
            alt={"logo"}
            src={logoImage}
            sx={{ width: 70, height: 70, mb: 2, cursor: "pointer" }}
          />
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              fullWidth
              label="Email Address"
              id="email"
              {...register("email", {
                required: "Email  is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email format",
                },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            <TextField
              fullWidth
              margin="normal"
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
              helperText={errors.password?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Grid sx={{ mt: 2 }} container>
              <Grid item xs>
                <Link to="/forgetPassword">Forgot password?</Link>
              </Grid>
              <Grid item>
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                  }}
                >
                  Don't have an account? <Link to="/signUp"> Sign Up</Link>
                </Stack>
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <GoogleLoginCom handleClick={handleLogin} />
          </Box>
        </Box>
      </Container>

      {isLoading && <Loader />}
    </>
  );
}
