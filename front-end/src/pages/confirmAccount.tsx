/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  CssBaseline,
  Paper,
  Stack,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { confirmAccountApi } from "../services/auth";
import { useEffect, useState, useCallback } from "react";
import logoImage from "../assets/logo.png";
import { SENDING_FAILED_MESSAGE } from "../constants/common";

export default function ConfirmAccount() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { search } = useLocation();
  const urlSearchParams = new URLSearchParams(search);
  const token = urlSearchParams.get("token");

  const [loading, setLoading] = useState<boolean>(true);
  const [success, setSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleConfirm = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const response = await confirmAccountApi({ token });
      if (response?.data) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setErrorMessage(
          "Confirmation failed. The link may be invalid or expired.",
        );
      }
    } catch (error: any) {
      console.error(SENDING_FAILED_MESSAGE, error);
      setErrorMessage(
        error?.response?.data?.message ||
          "Failed to confirm account. Please try again or request a new link.",
      );
    } finally {
      setLoading(false);
    }
  }, [token, navigate]);

  useEffect(() => {
    if (token) {
      handleConfirm();
    } else {
      setLoading(false);
      setErrorMessage("Missing confirmation token.");
    }
  }, [token, handleConfirm]);

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

          <Typography
            component="h1"
            variant="h5"
            sx={{ fontWeight: 700, letterSpacing: "-0.5px", mb: 1 }}
          >
            Confirm Your Account
          </Typography>

          {/* Loading State */}
          {loading && (
            <Stack alignItems="center" spacing={2} sx={{ my: 4 }}>
              <CircularProgress size={40} />
              <Typography variant="body2" color="text.secondary">
                Verifying your account details...
              </Typography>
            </Stack>
          )}

          {/* Success State */}
          {!loading && success && (
            <Stack alignItems="center" spacing={2} sx={{ my: 2 }}>
              <CheckCircleOutlineIcon color="success" sx={{ fontSize: 56 }} />
              <Typography
                variant="body1"
                sx={{ fontWeight: 600, textAlign: "center" }}
              >
                Account successfully confirmed!
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: "center" }}
              >
                Redirecting you to the sign-in page...
              </Typography>
            </Stack>
          )}

          {/* Error State */}
          {!loading && !success && (
            <Stack
              alignItems="center"
              spacing={2}
              sx={{ my: 2, width: "100%" }}
            >
              <ErrorOutlineIcon color="error" sx={{ fontSize: 56 }} />
              <Typography
                variant="body2"
                color="error"
                sx={{ textAlign: "center", fontWeight: 500 }}
              >
                {errorMessage}
              </Typography>
              <Button
                onClick={handleConfirm}
                fullWidth
                variant="contained"
                sx={{
                  mt: 2,
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
                Retry Confirmation
              </Button>
            </Stack>
          )}

          {/* Fallback Nav Link */}
          <Stack
            direction="row"
            spacing={0.5}
            justifyContent="center"
            alignItems="center"
            sx={{ mt: 3 }}
          >
            <Button
              component={RouterLink}
              to="/login"
              variant="text"
              color="primary"
              startIcon={<ArrowBackIcon fontSize="small" />}
              sx={{
                fontWeight: 600,
                textTransform: "none",
              }}
            >
              Back to Sign In
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
