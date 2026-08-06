import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  Divider,
} from "@mui/material";
import ForumIcon from "@mui/icons-material/Forum";
import GitHubIcon from "@mui/icons-material/GitHub";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { COLORS } from "../../styles";

export const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        pt: 8,
        pb: 4,
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        position: "relative",
        zIndex: 1,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid item xs={12} md={4}>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "10px",
                  background:
                    "linear-gradient(135deg, #7C4DFF 0%, #00E5FF 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ForumIcon sx={{ color: "#FFFFFF", fontSize: 20 }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#FFF" }}>
                Chatty
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{ color: COLORS.textSecondary, lineHeight: 1.6, pr: 2 }}
            >
              The modern real-time communication platform designed for
              individuals and fast-growing teams worldwide.
            </Typography>
          </Grid>

          <Grid item xs={6} sm={3} md={2}>
            <Typography
              variant="subtitle2"
              sx={{ color: "#FFF", fontWeight: 700, mb: 2 }}
            >
              Product
            </Typography>
            {["Features", "Integrations", "Enterprise", "Changelog"].map(
              (link) => (
                <Typography
                  key={link}
                  variant="body2"
                  component="a"
                  href="#"
                  sx={{
                    display: "block",
                    color: COLORS.textSecondary,
                    textDecoration: "none",
                    mb: 1,
                    "&:hover": { color: COLORS.secondary },
                  }}
                >
                  {link}
                </Typography>
              ),
            )}
          </Grid>

          <Grid item xs={6} sm={3} md={2}>
            <Typography
              variant="subtitle2"
              sx={{ color: "#FFF", fontWeight: 700, mb: 2 }}
            >
              Company
            </Typography>
            {["About Us", "Careers", "Blog", "Contact"].map((link) => (
              <Typography
                key={link}
                variant="body2"
                component="a"
                href="#"
                sx={{
                  display: "block",
                  color: COLORS.textSecondary,
                  textDecoration: "none",
                  mb: 1,
                  "&:hover": { color: COLORS.secondary },
                }}
              >
                {link}
              </Typography>
            ))}
          </Grid>

          <Grid item xs={6} sm={3} md={2}>
            <Typography
              variant="subtitle2"
              sx={{ color: "#FFF", fontWeight: 700, mb: 2 }}
            >
              Legal
            </Typography>
            {["Privacy Policy", "Terms of Service", "Security", "Cookies"].map(
              (link) => (
                <Typography
                  key={link}
                  variant="body2"
                  component="a"
                  href="#"
                  sx={{
                    display: "block",
                    color: COLORS.textSecondary,
                    textDecoration: "none",
                    mb: 1,
                    "&:hover": { color: COLORS.secondary },
                  }}
                >
                  {link}
                </Typography>
              ),
            )}
          </Grid>

          <Grid item xs={6} sm={3} md={2}>
            <Typography
              variant="subtitle2"
              sx={{ color: "#FFF", fontWeight: 700, mb: 2 }}
            >
              Socials
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton
                size="small"
                sx={{
                  color: COLORS.textSecondary,
                  "&:hover": { color: "#FFF" },
                }}
              >
                <TwitterIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  color: COLORS.textSecondary,
                  "&:hover": { color: "#FFF" },
                }}
              >
                <GitHubIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  color: COLORS.textSecondary,
                  "&:hover": { color: "#FFF" },
                }}
              >
                <LinkedInIcon fontSize="small" />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.08)", mb: 3 }} />

        <Typography
          variant="caption"
          align="center"
          display="block"
          sx={{ color: COLORS.textSecondary }}
        >
          © {new Date().getFullYear()} Chatty Inc. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};
