import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { emailRegex, FAILED, SUCCESS } from "../../constants/common";
import { showToast } from "../../utils/toast";
import { useForgetPasswordMutation } from "../../redux/features/auth/authApi";

export default function ForgetPassword() {
  const [forgetPassword] = useForgetPasswordMutation();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("emailOrUserName");
    const password = data.get("password");
    let userData;
    if (emailRegex.test(email)) {
      userData = {
        password,
        email,
      };
    } else {
      userData = {
        password,
        userName: email,
      };
    }

    forgetPassword(userData);
    // try {
    //   const response = await fetch(
    //     "http://localhost:5000/api/user/forget-password",
    //     {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify(userData),
    //     }
    //   );
    //   const result = await response.json();
    //   if (result.success) {
    //     showToast(SUCCESS, result.message);
    //   } else {
    //     showToast(FAILED, "Something is wrong ! ");
    //   }
    // } catch (error) {
    //   showToast(FAILED, "Something is wrong ! ");
    // }
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
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
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
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="New Password"
              type="password"
              id="password"
              // autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
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
    </>
  );
}
