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
import { useNavigate } from "react-router-dom";
import { inviteUserApi } from "../services/auth";
import { useForm } from "react-hook-form";
import { showToast } from "../utils/toast";
import {
  INVITATION_FAILED_MESSAGE,
  INVITATION_SENT_MESSAGE,
  SUCCESS,
  WARNING,
} from "../constants/common";

const defaultTheme = createTheme();

export default function InviteUser() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    mode: "onBlur", // validate on blur
  });

  const onSubmit = async (data: any) => {
    try {
      const response = await inviteUserApi(data);
      if (response.success) {
        showToast(SUCCESS, INVITATION_SENT_MESSAGE);
        reset();
      }
    } catch (error) {
      showToast(WARNING, INVITATION_FAILED_MESSAGE);
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
            Invite Your Friend
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
              id="email"
              label="Email Address"
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email address",
                },
              })}
              error={!!errors.email}
              helperText={
                typeof errors.email?.message === "string"
                  ? errors.email.message
                  : ""
              }
            />

            {/* Message Field */}
            <TextField
              margin="normal"
              fullWidth
              id="message"
              label="Message"
              multiline
              rows={3}
              {...register("message", {
                required: "Message is required",
                minLength: {
                  value: 5,
                  message: "Message must be at least 5 characters",
                },
              })}
              error={!!errors.message}
              helperText={
                typeof errors.message?.message === "string"
                  ? errors.message.message
                  : ""
              }
            />

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isSubmitting}
              sx={{ mt: 3, mb: 2 }}
            >
              {isSubmitting ? "Sending..." : "Send New Message"}
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
