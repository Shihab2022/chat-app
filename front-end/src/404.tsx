import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  Paper,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import logoImage from "../src/assets/logo.png";

export default function NotFoundPage() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `radial-gradient(circle at 50% 0%, ${alpha(
          theme.palette.primary.main,
          0.15,
        )} 0%, ${theme.palette.background.default} 70%)`,
        py: 4,
      }}
    >
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Paper
          elevation={0}
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: 4,
            border: `1px solid ${theme.palette.divider}`,
            backdropFilter: "blur(10px)",
            backgroundColor: alpha(theme.palette.background.paper, 0.8),
            boxShadow: `0 8px 32px 0 ${alpha(
              theme.palette.common.black,
              0.08,
            )}`,
          }}
        >
          {/* Brand Logo */}
          <Avatar
            component={RouterLink}
            to="/"
            alt="logo"
            src={logoImage}
            sx={{
              width: 64,
              height: 64,
              mb: 2,
              cursor: "pointer",
              transition: "transform 0.2s ease-in-out",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          />

          {/* 404 Headline */}
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontWeight: 800,
              fontSize: "4.5rem",
              lineHeight: 1,
              letterSpacing: "-2px",
              color: theme.palette.primary.main,
              mb: 1,
            }}
          >
            404
          </Typography>

          <Typography
            variant="h5"
            component="h2"
            sx={{
              fontWeight: 700,
              letterSpacing: "-0.5px",
              mb: 1,
              textAlign: "center",
            }}
          >
            Page Not Found
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 3, textAlign: "center" }}
          >
            The page you are looking for might have been removed, had its name
            changed, or is temporarily unavailable.
          </Typography>

          {/* Action Button */}
          <Button
            component={RouterLink}
            to="/"
            fullWidth
            variant="contained"
            startIcon={<HomeIcon />}
            sx={{
              py: 1.4,
              borderRadius: 2,
              fontSize: "1rem",
              fontWeight: 600,
              textTransform: "none",
              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
              "&:hover": {
                boxShadow: `0 6px 16px ${alpha(
                  theme.palette.primary.main,
                  0.4,
                )}`,
              },
            }}
          >
            Back to Home
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}
