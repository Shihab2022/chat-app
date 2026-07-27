import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Link,
  IconButton,
  Stack,
  Divider,
} from "@mui/material";
import {
  Forum as LogoIcon,
  GitHub as GitHubIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
} from "@mui/icons-material";
import { FOOTER_LINKS } from "../../config/constants";

export const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      role="contentinfo"
      sx={{ backgroundColor: "#1A1A1A", color: "#FFFFFF", pt: 8, pb: 4 }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} sx={{ mb: 6 }}>
          {/* Brand Info */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <LogoIcon sx={{ color: "#42A5F5", fontSize: 32 }} />
              <Typography
                variant="h6"
                sx={{ fontWeight: 800, color: "#FFFFFF" }}
              >
                ChatApp
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{
                color: "#6B7280",
                mb: 3,
                maxWidth: "300px",
                lineHeight: 1.6,
              }}
            >
              Next-generation real-time messenger empowering personal
              connections and enterprise workflow.
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton
                aria-label="GitHub"
                sx={{ color: "#6B7280", "&:hover": { color: "#FFFFFF" } }}
              >
                <GitHubIcon />
              </IconButton>
              <IconButton
                aria-label="Twitter"
                sx={{ color: "#6B7280", "&:hover": { color: "#42A5F5" } }}
              >
                <TwitterIcon />
              </IconButton>
              <IconButton
                aria-label="LinkedIn"
                sx={{ color: "#6B7280", "&:hover": { color: "#42A5F5" } }}
              >
                <LinkedInIcon />
              </IconButton>
            </Stack>
          </Grid>

          {/* Nav Categories */}
          {FOOTER_LINKS.map((col) => (
            <Grid key={col.category} item xs={6} sm={4} md={2}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 700, color: "#FFFFFF", mb: 2 }}
              >
                {col.category}
              </Typography>
              <Stack spacing={1.5}>
                {col.links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    underline="none"
                    sx={{
                      color: "#6B7280",
                      fontSize: "0.875rem",
                      transition: "color 0.2s ease",
                      "&:hover": { color: "#42A5F5" },
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </Stack>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)", mb: 4 }} />

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography variant="caption" sx={{ color: "#6B7280" }}>
            © {new Date().getFullYear()} ChatApp Inc. All rights reserved.
          </Typography>
          <Stack direction="row" spacing={3}>
            <Link
              href="#"
              underline="none"
              sx={{
                color: "#6B7280",
                fontSize: "0.75rem",
                "&:hover": { color: "#FFFFFF" },
              }}
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              underline="none"
              sx={{
                color: "#6B7280",
                fontSize: "0.75rem",
                "&:hover": { color: "#FFFFFF" },
              }}
            >
              Terms of Service
            </Link>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};
