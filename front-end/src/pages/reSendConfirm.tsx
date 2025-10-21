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
export default function ResendEmail() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      //   const response = await confirmAccountApi({});
      //   if (response?.data) {
      //     navigate("/chat");
      //   }
    } catch (error) {
      //   console.error("❌ Error sending invite:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
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
                // autoComplete="email"
                // autoFocus
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

        {isLoading && <Loader />}
      </>
    </>
  );
}
