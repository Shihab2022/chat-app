import React from "react";
import { Box, Container, Typography, IconButton, Divider } from "@mui/material";
import Grid from "@mui/material/Grid";
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
        pt: { xs: 6, md: 8 },
        pb: 4,
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        position: "relative",
        zIndex: 1,
        background:
          "linear-gradient(180deg, transparent 0%, rgba(10, 15, 30, 0.6) 100%)",
      }}
    >
      <Container maxWidth="lg">
        <Grid
          container
          spacing={3}
          sx={{
            mb: 5,
            justifyContent: { xs: "center", md: "space-between" },
            textAlign: { xs: "center", md: "left" },
            alignItems: { xs: "center", md: "flex-start" },
          }}
        >
          {/* Left Side: Brand Info */}
          <Grid sx={{ xs: 12, md: 7 }}>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}
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
                  boxShadow: "0 4px 15px rgba(124, 77, 255, 0.3)",
                }}
              >
                <ForumIcon sx={{ color: "#FFFFFF", fontSize: 20 }} />
              </Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 800, color: "#FFF", letterSpacing: 0.5 }}
              >
                Chatty
              </Typography>
            </Box>

            <Typography
              variant="body2"
              sx={{
                color: COLORS.textSecondary || "rgba(255, 255, 255, 0.6)",
                lineHeight: 1.6,
                maxWidth: "460px",
              }}
            >
              The modern real-time communication platform designed for
              individuals and fast-growing teams worldwide.
            </Typography>
          </Grid>

          {/* Right Side: Social Links (Right-aligned on desktop) */}
          <Grid
            sx={{
              xs: 12,
              md: 5,
              display: "flex",
              flexDirection: "column",
              alignItems: { xs: "flex-start", md: "flex-end" },
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                color: "#FFF",
                fontWeight: 700,
                mb: 1.5,
                textAlign: { xs: "left", md: "right" },
              }}
            >
              Connect With Us
            </Typography>

            <Box sx={{ display: "flex", gap: 1.5 }}>
              {[
                { icon: <TwitterIcon fontSize="small" />, link: "#" },
                { icon: <GitHubIcon fontSize="small" />, link: "#" },
                { icon: <LinkedInIcon fontSize="small" />, link: "#" },
              ].map((item, i) => (
                <IconButton
                  key={i}
                  size="small"
                  component="a"
                  href={item.link}
                  sx={{
                    color: "rgba(255, 255, 255, 0.7)",
                    backgroundColor: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    p: 1.2,
                    borderRadius: "12px",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      color: "#FFF",
                      backgroundColor: "rgba(124, 77, 255, 0.2)",
                      borderColor: "#7C4DFF",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  {item.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.08)", mb: 3 }} />

        {/* Bottom Bar */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: COLORS.textSecondary || "rgba(255, 255, 255, 0.5)",
              fontWeight: 500,
            }}
          >
            © {new Date().getFullYear()} Chatty Inc. All rights reserved.
          </Typography>

          <Box sx={{ display: "flex", gap: 3 }}>
            {["Privacy Policy", "Terms of Service", "Cookie Settings"].map(
              (link) => (
                <Typography
                  key={link}
                  variant="caption"
                  sx={{
                    color: "rgba(255, 255, 255, 0.5)",
                    cursor: "pointer",
                    transition: "color 0.2s ease",
                    "&:hover": { color: "#00E5FF" },
                  }}
                >
                  {link}
                </Typography>
              ),
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
