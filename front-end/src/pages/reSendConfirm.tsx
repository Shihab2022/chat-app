/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import { reSendConfirmEmil } from "../services/auth";
import { showToast } from "../utils/toast";
import {
  EMAIL_SENT_SUCCESSFULLY_MESSAGE,
  ENTER_YOUR_EMAIL_MESSAGE,
  SENDING_FAILED_MESSAGE,
  SUCCESS,
  WARNING,
} from "../constants/common";
import AuthLayout from "../components/ui/AuthLayout";

export default function ResendEmail() {
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
    <AuthLayout
      title="Resend Confirmation"
      subtitle="Enter your registered email address and we will send you a new confirmation link."
    >
      {isEmailSent ? (
        <Box sx={{ textAlign: "center", py: 2 }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              mx: "auto",
              mb: 2.5,
              borderRadius: "18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(46,213,169,0.12)",
              color: "#2DD4A7",
              border: "1px solid rgba(46,213,169,0.24)",
            }}
          >
            <MailOutlineRoundedIcon sx={{ fontSize: 34 }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            Check your inbox
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, lineHeight: 1.6 }}>
            A confirmation link has been sent to <strong>{submittedEmail}</strong>. Please check your
            email (and spam folder) to verify your account.
          </Typography>
          <Button variant="outlined" onClick={() => setIsEmailSent(false)} sx={{ py: 1.2, borderRadius: 10 }}>
            Resend to another email
          </Button>
        </Box>
      ) : (
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: "100%" }}>
          <TextField
            fullWidth
            required
            id="email"
            label="Email address"
            name="email"
            type="email"
            autoComplete="email"
            autoFocus
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <MailOutlineRoundedIcon fontSize="small" color="action" />
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
            disabled={isLoading}
            sx={{ mt: 1.5, py: 1.5 }}
          >
            {isLoading ? <CircularProgress size={22} color="inherit" /> : "Send Confirmation Link"}
          </Button>
        </Box>
      )}

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
    </AuthLayout>
  );
}