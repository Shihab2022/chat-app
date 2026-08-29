/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import MarkEmailReadRoundedIcon from "@mui/icons-material/MarkEmailReadRounded";
import { confirmAccountApi } from "../services/auth";
import { SENDING_FAILED_MESSAGE } from "../constants/common";
import AuthLayout from "../components/ui/AuthLayout";

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
        setErrorMessage("Confirmation failed. The link may be invalid or expired.");
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

  const toneColor = errorMessage
    ? theme.palette.error.main
    : success
      ? theme.palette.success.main
      : theme.palette.primary.main;

  return (
    <AuthLayout
      title={success ? "Account Confirmed" : errorMessage ? "Confirmation Failed" : "Confirming…"}
      subtitle={
        success
          ? "Your account has been verified successfully. Redirecting you to sign in…"
          : errorMessage
            ? errorMessage
            : "Please wait a moment while we verify your account."
      }
    >
      <Box sx={{ textAlign: "center", py: 2, width: "100%" }}>
        <Box
          sx={{
            width: 72,
            height: 72,
            mx: "auto",
            mb: 3,
            borderRadius: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: alpha(toneColor, 0.14),
            color: toneColor,
            border: `1px solid ${alpha(toneColor, 0.28)}`,
          }}
        >
          {loading ? (
            <CircularProgress size={34} sx={{ color: toneColor }} />
          ) : success ? (
            <CheckCircleRoundedIcon sx={{ fontSize: 38 }} />
          ) : errorMessage ? (
            <ErrorOutlineRoundedIcon sx={{ fontSize: 38 }} />
          ) : (
            <MarkEmailReadRoundedIcon sx={{ fontSize: 38 }} />
          )}
        </Box>

        {errorMessage && !loading && (
          <Button
            variant="outlined"
            fullWidth
            onClick={() => navigate("/re-send-confirm")}
            sx={{ py: 1.2, borderRadius: 10 }}
          >
            Resend confirmation email
          </Button>
        )}

        {success && (
          <Typography variant="body2" color="text.secondary">
            Taking too long?{" "}
            <Box
              component="span"
              onClick={() => navigate("/login")}
              sx={{ color: "primary.light", fontWeight: 600, cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
            >
              Sign in now
            </Box>
          </Typography>
        )}
      </Box>
    </AuthLayout>
  );
}
