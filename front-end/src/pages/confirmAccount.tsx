/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
import { Avatar, Box, Button, Container, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { confirmAccountApi } from "../services/auth";
import { useEffect } from "react";
import logoImage from "../assets/logo.png";
import { SENDING_FAILED_MESSAGE } from "../constants/common";
export default function ConfirmAccount() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const urlSearchParams = new URLSearchParams(search);
  const token = urlSearchParams.get("token");
  const onSubmit = async () => {
    try {
      const response = await confirmAccountApi({ token });
      if (response?.data) {
        navigate("/login");
      }
    } catch (error) {
      console.error(SENDING_FAILED_MESSAGE, error);
    }
  };
  useEffect(() => {
    onSubmit();
  }, []);
  return (
    <>
      <Container component="main" maxWidth="xs">
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

          <Button
            onClick={onSubmit}
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Confirm and Login
          </Button>
        </Box>
      </Container>
    </>
  );
}
