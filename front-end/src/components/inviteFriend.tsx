/* eslint-disable prefer-const */
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import logoImage from "../assets/logo.png";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { inviteUserApi } from "../services/auth";

const defaultTheme = createTheme();

export default function InviteUser() {
  const navigate = useNavigate();
  // const location = useLocation();
  // const admin = location?.state?.user;
  const handleSubmit = async (event: {
    preventDefault: () => void;
    currentTarget: HTMLFormElement | undefined;
  }) => {
    event.preventDefault();
    // const data = new FormData(event.currentTarget);
    // const email = data.get("email");
    // const lastMessage = data.get("message");

    // let userData = {
    //   admin: admin.id,
    //   participants: {
    //     participant: email,
    //     lastMessage,
    //     timestamp: new Date(),
    //   },
    // };
    // try {
    //   const response = await fetch("http://localhost:5000/api/invite/send", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(userData),
    //   });
    //   const result = await response.json();
    //   if (result.success) {
    //     showToast(SUCCESS, result.message);
    //     navigate("/chat");
    //   } else {
    //     showToast(FAILED, "Something is wrong ! ");
    //   }
    // } catch (error) {
    //   showToast(FAILED, "Something is wrong ! ");
    // }
  };
  const inviteUser = async (params: any) => {
    const res = await inviteUserApi({});
    console.log(res);
  };
  return (
    <ThemeProvider theme={defaultTheme}>
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
            Invite Your Friend
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
            <TextField
              margin="normal"
              required
              fullWidth
              name="message"
              label="Message"
              type="text"
              id="text"
            />
            <Button
              // type="submit"
              onClick={() => inviteUser({})}
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Send New Message
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
