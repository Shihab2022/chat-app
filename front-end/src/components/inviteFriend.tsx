/* eslint-disable @typescript-eslint/no-explicit-any */
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import CircularProgress from "@mui/material/CircularProgress";
import SendIcon from "@mui/icons-material/Send";
import logoImage from "../assets/logo.png";
import { alpha, useTheme } from "@mui/material/styles";
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

interface InviteFormData {
  email: string;
  message: string;
}

export default function InviteUser() {
  const navigate = useNavigate();
  const theme = useTheme();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<InviteFormData>({
    mode: "onBlur",
  });

  const onSubmit = async (data: InviteFormData) => {
    try {
      const response = await inviteUserApi(data);
      if (response?.success) {
        showToast(SUCCESS, INVITATION_SENT_MESSAGE);
        reset();
        navigate("/manageUser");
      }
    } catch (error) {
      showToast(WARNING, INVITATION_FAILED_MESSAGE);
      console.error(error);
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
          0.12,
        )} 0%, ${theme.palette.background.default} 70%)`,
        py: 4,
      }}
    >
      <Container component="main" maxWidth="xs">
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
          <Avatar
            onClick={() => navigate("/")}
            alt="logo"
            src={logoImage}
            sx={{
              width: 64,
              height: 64,
              mb: 2,
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
            sx={{
              fontWeight: 800,
              letterSpacing: "-0.5px",
              mb: 0.5,
              textAlign: "center",
            }}
          >
            Invite Your Friend
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 3, textAlign: "center" }}
          >
            Send a personal invite to start chatting together.
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{ width: "100%" }}
          >
            {/* Email Field */}
            <TextField
              margin="normal"
              fullWidth
              id="email"
              label="Email Address"
              type="email"
              autoComplete="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email address",
                },
              })}
              error={!!errors.email}
              helperText={errors.email?.message || ""}
              sx={{ mb: 1.5 }}
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
              helperText={errors.message?.message || ""}
              sx={{ mb: 2 }}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isSubmitting}
              startIcon={
                isSubmitting ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <SendIcon />
                )
              }
              sx={{
                py: 1.4,
                mt: 1,
                borderRadius: 2,
                fontSize: "0.95rem",
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
              {isSubmitting ? "Sending..." : "Send Invitation"}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
