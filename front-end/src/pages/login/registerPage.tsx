/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { showToast } from "../../utils/toast";
import {
  COMMON_ERROR_MESSAGE,
  FAILED,
  REGISTER_SUCCESS,
  SUCCESS,
} from "../../constants/common";
import Loader from "../../components/loader";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  Stack,
  TextField,
  alpha,
  useTheme,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm, SubmitHandler } from "react-hook-form";
import { googleRegisterApi, registerUserApi } from "../../services/auth";
import logoImage from "../../assets/logo.png";
import GoogleLoginCom from "./googleLoginCom";

interface SignUpFormInputs {
  userName: string;
  name: string;
  email: string;
  password: string;
}

export default function SignUp() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => setShowPassword((prev) => !prev);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormInputs>({
    defaultValues: {
      userName: "",
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<SignUpFormInputs> = async (data) => {
    try {
      setIsLoading(true);
      const res = await registerUserApi(data);
      if (res?.data?.success) {
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
            Create an Account
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 3, textAlign: "center" }}
          >
            Join now and start chatting with your friends
          </Typography>

          {/* Registration Form */}
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            sx={{ width: "100%" }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  id="userName"
                  {...register("userName", {
                    required: "First name is required",
                  })}
                  error={!!errors.userName}
                  helperText={errors.userName?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  id="name"
                  {...register("name", {
                    required: "Last name is required",
                  })}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email Address"
                  id="email"
                  autoComplete="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email format",
                    },
                  })}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
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

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{
                mt: 3,
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
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Sign Up"
              )}
            </Button>

            {/* Social Divider */}
            <Divider sx={{ my: 3 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ px: 1 }}
              >
                OR
              </Typography>
            </Divider>

            {/* Google Signup */}
            <Box
              sx={{ width: "100%", display: "flex", justifyContent: "center" }}
            >
              <GoogleLoginCom handleClick={handleRegister} />
            </Box>

            {/* Link back to Login */}
            <Stack
              direction="row"
              spacing={0.5}
              justifyContent="center"
              alignItems="center"
              sx={{ mt: 3 }}
            >
              <Typography variant="body2" color="text.secondary">
                Already have an account?
              </Typography>
              <Link
                component={RouterLink}
                to="/login"
                variant="body2"
                color="primary"
                sx={{
                  fontWeight: 600,
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Sign In
              </Link>
            </Stack>
          </Box>
        </Paper>
      </Container>

      {isLoading && <Loader />}
    </Box>
  );
}
