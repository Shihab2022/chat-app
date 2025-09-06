import { Container, Typography, Button, Box, Stack } from "@mui/material";
import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <Container maxWidth="sm">
      <Stack
        direction="row"
        spacing={2}
        sx={{
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100vh",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h1" component="h2" gutterBottom>
            404
          </Typography>
          <Typography variant="h5" gutterBottom>
            Page Not Found
          </Typography>
          <Typography variant="body1" paragraph>
            The page you are looking for might have been removed, had its name
            changed, or is temporarily unavailable.
          </Typography>
          <Button variant="contained" component={Link} to="/">
            Go to Homepage
          </Button>
        </Box>
      </Stack>
    </Container>
  );
}

export default NotFoundPage;
