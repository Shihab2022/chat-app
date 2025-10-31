import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import logoImage from "../assets/logo.png";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Loader from "../components/loader";
import { reSendConfirmEmil } from "../services/auth";
import { showToast } from "../utils/toast";
import {
  EMAIL_SENT_SUCCESSFULLY_MESSAGE,
  ENTER_YOUR_EMAIL_MESSAGE,
  SENDING_FAILED_MESSAGE,
  SUCCESS,
  WARNING,
} from "../constants/common";
export default function ResendEmail() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSend, setIsEmailSend] = useState(!false);

  const handleSubmit = async (event: {
    preventDefault: () => void;
    currentTarget: HTMLFormElement | undefined;
  }) => {
    try {
      event.preventDefault();
      setIsLoading(true);

      const data = new FormData(event.currentTarget);
      const email = data.get("email");
      if (!email) {
        showToast(WARNING, ENTER_YOUR_EMAIL_MESSAGE);
        return;
      }
      const response = await reSendConfirmEmil({ email });
      if (response?.success) {
        setIsEmailSend(true);
        showToast(SUCCESS, EMAIL_SENT_SUCCESSFULLY_MESSAGE);
      }
    } catch (error) {
      console.error(SENDING_FAILED_MESSAGE, error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <>
        {isEmailSend ? (
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
              <Box
                sx={{
                  mt: 1,
                  background: "#f8d5d5ff",
                  width: "100%",
                  padding: 2,
                  borderRadius: 1,
                }}
              >
                <Typography component="h1" variant="h5">
                  {" "}
                  Check your email and confirm account to access
                </Typography>
              </Box>
            </Box>
          </Container>
        ) : (
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
              <Typography component="h1" variant="h5">
                Confirm Your Account
              </Typography>
              <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ mt: 1 }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Send Email
                </Button>
              </Box>
            </Box>
          </Container>
        )}

        {isLoading && <Loader />}
      </>
    </>
  );
}
