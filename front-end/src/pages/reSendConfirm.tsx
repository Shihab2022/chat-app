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
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import { reSendConfirmEmil } from "../services/auth";
import { showToast } from "../utils/toast";
import {
  EMAIL_SENT_SUCCESSFULLY_MESSAGE,
  ENTER_YOUR_EMAIL_MESSAGE,
  SENDING_FAILED_MESSAGE,
  SUCCESS,
  WARNING,
} from "../constants/common";
import { CircularProgress, Link, Paper, Stack } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
export default function ResendEmail() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      setIsLoading(true);

      const data = new FormData(event.currentTarget);
      const email = data.get("email") as string;

      if (!email) {
        showToast(WARNING, ENTER_YOUR_EMAIL_MESSAGE);
        return;
      }

      setSubmittedEmail(email);
      const response = await reSendConfirmEmil({ email });

      if (response?.success) {
        setIsEmailSent(true);
        showToast(SUCCESS, EMAIL_SENT_SUCCESSFULLY_MESSAGE);
      }
    } catch (error) {
      console.error(SENDING_FAILED_MESSAGE, error);
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
          {/* Logo */}
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

          {isEmailSent ? (
            /* Success State */
            <Stack
              spacing={2}
              sx={{ width: "100%", mt: 1, alignContent: "center" }}
            >
              <Avatar
                sx={{
                  bgcolor: alpha(theme.palette.success.main, 0.1),
                  color: "success.main",
                  width: 56,
                  height: 56,
                }}
              >
                <MarkEmailReadIcon fontSize="large" />
              </Avatar>

              <Typography
                component="h1"
                variant="h5"
                sx={{ fontWeight: 700, letterSpacing: "-0.5px" }}
              >
                Check Your Email
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: "center", mb: 1 }}
              >
                We have sent a verification link to{" "}
                <strong>{submittedEmail || "your email address"}</strong>.
                Please check your inbox and confirm your account.
              </Typography>

              <Button
                fullWidth
                variant="outlined"
                onClick={() => setIsEmailSent(false)}
                sx={{
                  mt: 2,
                  py: 1.2,
                  borderRadius: 2,
                  fontWeight: 600,
                  textTransform: "none",
                }}
              >
                Resend to another email
              </Button>
            </Stack>
          ) : (
            /* Form State */
            <>
              <Typography
                component="h1"
                variant="h5"
                sx={{ fontWeight: 700, letterSpacing: "-0.5px" }}
              >
                Resend Confirmation
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 3, textAlign: "center" }}
              >
                Enter your registered email address and we will send you a new
                confirmation link.
              </Typography>

              <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ width: "100%" }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isLoading}
                  sx={{
                    mt: 3,
                    mb: 2,
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
                    "Send Confirmation Link"
                  )}
                </Button>
              </Box>
            </>
          )}

          {/* Navigation link */}
          <Stack
            direction="row"
            spacing={0.5}
            sx={{ mt: 3, alignItems: "center", justifyContent: "center" }}
          >
            <Link
              component={RouterLink}
              to="/login"
              variant="body2"
              color="primary"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.5,
                fontWeight: 600,
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              <ArrowBackIcon fontSize="small" /> Back to Sign In
            </Link>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
