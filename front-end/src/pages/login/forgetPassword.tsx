/* eslint-disable @typescript-eslint/no-unused-vars */
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import logoImage from "../../assets/logo.png";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { SUCCESS } from "../../constants/common";
import { showToast } from "../../utils/toast";
import Loader from "../../components/loader";
import { useNavigate } from "react-router-dom";
import { forgotPasswordApi } from "../../services/auth";
import { useState } from "react";

export default function ForgetPassword() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: {
    preventDefault: () => void;
    currentTarget: HTMLFormElement | undefined;
  }) => {
    event.preventDefault();
    try {
      setIsLoading(true);
      const data = new FormData(event.currentTarget);
      const email = data.get("emailOrUserName");
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
          <Typography component="h1" variant="h5">
            Forget Password
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
              label="Email Address Or User Name"
              name="emailOrUserName"
              // autoComplete="email"
              // autoFocus
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Forget Password
            </Button>
          </Box>
        </Box>
      </Container>

      {isLoading && <Loader />}
    </>
  );
}
