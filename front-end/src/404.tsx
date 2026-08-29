import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Box, Button, Container, Typography, useTheme } from "@mui/material";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import Logo from "./components/ui/Logo";

export default function NotFoundPage() {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.palette.background.default,
        py: 6,
      }}
    >
      <Container component="main" maxWidth="xs" sx={{ px: 2 }}>
        <Box sx={{ textAlign: "center" }}>
          <Logo onClick={() => navigate("/")} size={48} />

          <Box
            sx={{
              mt: 4,
              mb: 1.5,
              fontSize: { xs: "5rem", sm: "6.5rem" },
              fontWeight: 800,
              letterSpacing: "-0.05em",
              background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.main} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: 1,
            }}
          >
            404
          </Box>

          <Typography variant="h5" component="h1" sx={{ fontWeight: 700, mb: 1.5 }}>
            Page not found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
            The page you’re looking for might have been removed, had its name changed, or is
            temporarily unavailable.
          </Typography>
          <Button
            component={RouterLink}
            to="/"
            variant="contained"
            size="large"
            startIcon={<HomeRoundedIcon />}
            sx={{ py: 1.5, px: 3 }}
          >
            Back to Home
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
