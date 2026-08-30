/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
} from "@mui/material";
import { Visibility, VisibilityOff, ArrowForwardRounded } from "@mui/icons-material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useForm, SubmitHandler } from "react-hook-form";
import { useDispatch } from "react-redux";
import { acceptInviteApi } from "../services/auth";
import { ACCESS_TOKEN_KEY, SENDING_FAILED_MESSAGE } from "../constants/common";
import {
  SET_CONVERSATION,
  SET_RECEIVER_ID,
} from "../redux/features/chat/conversationSlice";
import { groupMessagesByDate } from "../utils/timeFormat";
import AuthLayout from "../components/ui/AuthLayout";

interface AcceptInviteForm {
  firstname: string;
  lastname: string;
  password: string;
}

export default function AcceptInvite() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { search } = useLocation();
  const urlSearchParams = new URLSearchParams(search);
  const token = urlSearchParams.get("token");

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AcceptInviteForm>({
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<AcceptInviteForm> = async (data) => {
    try {
      const params = { token, ...data };
      const response = await acceptInviteApi(params);
      if (response?.data?.accessToken) {
        const { accessToken: receivedToken, data: inviteData, mess } = response?.data;
        dispatch(SET_RECEIVER_ID(inviteData?.sender_id));
        const formattedMessage = groupMessagesByDate(mess);
        dispatch(SET_CONVERSATION(formattedMessage));
        localStorage.setItem(ACCESS_TOKEN_KEY, receivedToken);
        navigate("/chat");
        reset();
      }
    } catch (error) {
      console.error(SENDING_FAILED_MESSAGE, error);
    }
  };

  return (
    <AuthLayout
      title="Accept Invitation"
      subtitle="Complete your profile details below to join the conversation."
    >
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 0.5, width: "100%" }}>
        <Grid container spacing={2}>
          <Grid sx={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="First Name"
              id="firstname"
              autoComplete="given-name"
              {...register("firstname", { required: "First Name is required" })}
              error={!!errors.firstname}
              helperText={typeof errors.firstname?.message === "string" ? errors.firstname.message : ""}
            />
          </Grid>
          <Grid sx={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Last Name"
              id="lastname"
              autoComplete="family-name"
              {...register("lastname", { required: "Last Name is required" })}
              error={!!errors.lastname}
              helperText={typeof errors.lastname?.message === "string" ? errors.lastname.message : ""}
            />
          </Grid>
        </Grid>

        <TextField
          margin="normal"
          fullWidth
          label="Password"
          id="password"
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

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={isSubmitting}
          endIcon={isSubmitting ? undefined : <ArrowForwardRounded />}
          sx={{ mt: 1.5, py: 1.5 }}
        >
          {isSubmitting ? <CircularProgress size={22} color="inherit" /> : "Accept Invitation"}
        </Button>

        <Stack direction="row" sx={{ mt: 3, justifyContent: "center", alignItems: "center" }}>
          <Link
            component={RouterLink}
            to="/login"
            variant="body2"
            sx={{
              color: "primary.main",
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
