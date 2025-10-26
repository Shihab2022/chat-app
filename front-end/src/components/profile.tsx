/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Avatar,
  Typography,
  Container,
  Grid,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
} from "@mui/material";
import { randomTwoDigit } from "../utils/common";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { updateUserInfoAPI } from "../services/auth";
import { useState } from "react";

export default function Profile({ user }: { user: any }) {
  const { loginUser } = useSelector((state: RootState) => state?.auth);
  const { img, email, name, bio } = loginUser;
  const [userName, setUserName] = useState(name);
  const [userBio, setUserBio] = useState(user.bio);
  const updateUserData = async () => {
    try {
      const res = await updateUserInfoAPI({
        name: userName,
        bio: userBio,
      });
      console.log({ res });
      // Function to handle user data update
    } catch (error) {
      console.log({ error });
    }
  };
  return (
    <>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Avatar
                  alt={name}
                  src={
                    img ||
                    `https://randomuser.me/api/portraits/men/${randomTwoDigit()}.jpg`
                  }
                  sx={{ width: 150, height: 150, mb: 2 }}
                />
                <Typography variant="h5" component="div" gutterBottom>
                  {name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {email}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  About Me
                </Typography>
                <Typography variant="body1" paragraph>
                  {bio}
                </Typography>

                {/* Example of editable fields */}
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Edit Profile
                  </Typography>
                  <TextField
                    label="Name"
                    variant="outlined"
                    fullWidth
                    defaultValue={userName}
                    sx={{ mb: 2 }}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                  <TextField
                    label="Bio"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    onChange={(e) => setUserBio(e.target.value)}
                    defaultValue={bio}
                    sx={{ mb: 2 }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={updateUserData}
                  >
                    Save Changes
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
