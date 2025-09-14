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
import { useNavigate } from "react-router-dom";
import { randomTwoDigit, toStartCaseStr } from "../utils/common";

export default function Profile({ user }: { user: any }) {
  const navigate = useNavigate();
  const { name = "Md Shihab Uddin ", img, email = "shihab@gmail.com" } = user;

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
                  {user.bio}
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
                    defaultValue={user.name}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    label="Bio"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    defaultValue={user.bio}
                    sx={{ mb: 2 }}
                  />
                  <Button variant="contained" color="primary">
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
