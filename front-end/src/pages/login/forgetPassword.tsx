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
} from "@mui/material";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { SUCCESS } from "../../constants/common";
import { showToast } from "../../utils/toast";
import { forgotPasswordApi } from "../../services/auth";
import AuthLayout from "../../components/ui/AuthLayout";

export default function ForgetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setIsLoading(true);
      const res = await forgotPasswordApi({ email });
      if (res?.success) {
        showToast(SUCCESS, "Please check your email to reset password");
      }
    } catch (error) {
      console.log({ error });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Forgot password?"
      subtitle="Enter your email address and we'll send you instructions to reset your password."
    >
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: "100%" }}>
        <TextField
          fullWidth
          margin="normal"
          required
          id="email"
          label="Email address"
          name="email"
          type="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(event) => setEmail(event.target.value)}
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
          disabled={isLoading || !email.trim()}
          sx={{ mt: 1.5, py: 1.5 }}
        >
          {isLoading ? <CircularProgress size={22} color="inherit" /> : "Send Reset Link"}
        </Button>

        <Stack direction="row" spacing={0.75} sx={{ mt: 3, justifyContent: "center", alignItems: "center" }}>
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