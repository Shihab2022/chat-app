/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Link, useNavigate } from "react-router-dom";
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
  Grid,
  IconButton,
  InputAdornment,
  TextField,
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
          <Typography className="text-4xl " component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            sx={{ mt: 3 }}
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
                  {...register("name", { required: "Last name is required" })}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email Address"
                  id="email"
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
                        <IconButton onClick={toggleShowPassword} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
            <Grid sx={{ mt: 2 }} container justifyContent="flex-end">
              <Grid item>
                <Link to="/login">Already have an account? Sign in</Link>
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <GoogleLoginCom handleClick={handleRegister} />
          </Box>
        </Box>
      </Container>
      {isLoading && <Loader />}
    </>
  );
}
