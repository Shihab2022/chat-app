import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Link, useNavigate } from "react-router-dom";
import { emailRegex, LOGIN_SUCCESS, SUCCESS } from "../../constants/common";
import { showToast } from "../../utils/toast";
import { useLoginMutation } from "../../redux/features/auth/authApi";
import Loader from "../../components/loader";
import { useAppDispatch } from "../../redux/hooks";
import { setUser } from "../../redux/features/auth/authSlice";

export default function SignIn() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [loginUser, { data, isLoading, isSuccess }] = useLoginMutation();

  if (isLoading) {
    return <Loader />;
  }
  if (isSuccess) {
    showToast(SUCCESS, LOGIN_SUCCESS);
    dispatch(setUser(data.data));
    navigate("/chat");
  }
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
    loginUser(userData);
  };

  return (
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
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
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
            label="Password"
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
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link to="/forgetPassword">Forgot password?</Link>
            </Grid>
            <Grid item>
              <Link to="/signUp">{"Don't have an account? Sign Up"}</Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
