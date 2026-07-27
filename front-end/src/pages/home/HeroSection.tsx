import React from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Card,
  Avatar,
  Badge,
  Chip,
  Stack,
} from "@mui/material";
import {
  VideoCall as VideoCallIcon,
  Notifications as NotificationsIcon,
  EmojiEmotions as EmojiIcon,
  Done as DoneIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";

export const HeroSection: React.FC = () => {
  return (
    <Box
      component="section"
      aria-label="Hero Section"
      sx={{
        pt: { xs: 8, md: 14 },
        pb: { xs: 8, md: 12 },
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(135deg, #F5F7FB 0%, #EBF3FA 100%)",
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            gap: { xs: 6, md: 8 },
          }}
        >
          {/* Left Column: Headline and Call-to-Actions */}
          <Box sx={{ flex: 1, textAlign: { xs: "center", md: "left" } }}>
            <Chip
              label="Real-Time Messenger v2.0 Released"
              color="primary"
              variant="outlined"
              size="small"
              sx={{
                mb: 3,
                fontWeight: 600,
                backgroundColor: "rgba(25, 118, 210, 0.08)",
                border: "1px solid rgba(25, 118, 210, 0.2)",
              }}
            />
            <Typography
              variant="h1"
              component="h1"
              sx={{
                fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4rem" },
                fontWeight: 800,
                lineHeight: 1.15,
                color: "#1A1A1A",
                letterSpacing: "-0.02em",
                mb: 2.5,
              }}
            >
              Connect. Chat.{" "}
              <Box
                component="span"
                sx={{
                  background:
                    "linear-gradient(45deg, #1976D2 30%, #42A5F5 90%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Collaborate.
              </Box>
            </Typography>

            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: "1rem", sm: "1.125rem" },
                color: "#6B7280",
                mb: 4,
                maxWidth: "540px",
                mx: { xs: "auto", md: "0" },
                lineHeight: 1.6,
              }}
            >
              Secure real-time messaging for friends, teams, and communities.
              Fast, reliable, and beautifully designed for seamless interaction.
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              justifyContent={{ xs: "center", md: "flex-start" }}
            >
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForwardIcon />}
                aria-label="Get Started with Chat App"
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: "12px",
                  fontSize: "1rem",
                  fontWeight: 600,
                  textTransform: "none",
                  backgroundColor: "#1976D2",
                  boxShadow: "0px 10px 20px rgba(25, 118, 210, 0.25)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "#1565C0",
                    transform: "scale(1.03)",
                    boxShadow: "0px 14px 28px rgba(25, 118, 210, 0.35)",
                  },
                }}
              >
                Get Started
              </Button>

              <Button
                variant="outlined"
                size="large"
                aria-label="Learn More about Features"
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: "12px",
                  fontSize: "1rem",
                  fontWeight: 600,
                  textTransform: "none",
                  borderColor: "rgba(25, 118, 210, 0.4)",
                  color: "#1976D2",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    borderColor: "#1976D2",
                    backgroundColor: "rgba(25, 118, 210, 0.04)",
                    transform: "scale(1.03)",
                  },
                }}
              >
                Learn More
              </Button>
            </Stack>
          </Box>

          {/* Right Column: MUI Composition Visual Graphic */}
          <Box
            sx={{
              flex: 1,
              position: "relative",
              width: "100%",
              minHeight: { xs: "380px", sm: "440px", md: "480px" },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Glassmorphism Background Card Container */}
            <Card
              elevation={0}
              sx={{
                width: "100%",
                maxWidth: "460px",
                borderRadius: "24px",
                background: "rgba(255, 255, 255, 0.75)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255, 255, 255, 0.9)",
                boxShadow: "0px 20px 40px rgba(0, 0, 0, 0.06)",
                p: 3,
                position: "relative",
              }}
            >
              {/* Chat Header Mock */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 3,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    variant="dot"
                    sx={{
                      "& .MuiBadge-badge": {
                        backgroundColor: "#44b700",
                        color: "#44b700",
                        boxShadow: "0 0 0 2px #fff",
                        "&::after": {
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          borderRadius: "50%",
                          animation: "ripple 1.2s infinite ease-in-out",
                          border: "1px solid currentColor",
                          content: '""',
                        },
                      },
                      "@keyframes ripple": {
                        "0%": { transform: "scale(.8)", opacity: 1 },
                        "100%": { transform: "scale(2.4)", opacity: 0 },
                      },
                    }}
                  >
                    <Avatar
                      alt="Team Channel"
                      src="https://i.pravatar.cc/150?img=60"
                    />
                  </Badge>
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 700, color: "#1A1A1A" }}
                    >
                      Design Team Sync
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#6B7280" }}>
                      8 members online
                    </Typography>
                  </Box>
                </Box>
                <VideoCallIcon sx={{ color: "#1976D2", cursor: "pointer" }} />
              </Box>

              {/* Chat Bubble 1 - Received */}
              <Card
                elevation={0}
                sx={{
                  backgroundColor: "#F5F7FB",
                  borderRadius: "16px 16px 16px 4px",
                  p: 1.5,
                  mb: 2,
                  maxWidth: "85%",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: "#1A1A1A", fontWeight: 500 }}
                >
                  Are we still on for the interactive prototype review today? 🚀
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "#6B7280",
                    display: "block",
                    textAlign: "right",
                    mt: 0.5,
                  }}
                >
                  10:42 AM
                </Typography>
              </Card>

              {/* Chat Bubble 2 - Sent */}
              <Card
                elevation={0}
                sx={{
                  backgroundColor: "#1976D2",
                  color: "#FFFFFF",
                  borderRadius: "16px 16px 4px 16px",
                  p: 1.5,
                  mb: 1,
                  ml: "auto",
                  maxWidth: "85%",
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Yes! All updates have been deployed to production. Let’s jump
                  in.
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    gap: 0.5,
                    mt: 0.5,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: "rgba(255, 255, 255, 0.8)" }}
                  >
                    10:43 AM
                  </Typography>
                  <DoneIcon sx={{ fontSize: 14, color: "#FFFFFF" }} />
                </Box>
              </Card>
            </Card>

            {/* Floating Component 1: Online Status Badge */}
            <Card
              elevation={4}
              sx={{
                position: "absolute",
                top: "-15px",
                left: { xs: "-10px", sm: "-20px" },
                borderRadius: "16px",
                p: 1.5,
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                backgroundColor: "#FFFFFF",
                boxShadow: "0px 12px 24px rgba(0,0,0,0.08)",
                transition: "transform 0.3s ease",
                "&:hover": { transform: "translateY(-4px)" },
              }}
            >
              <Avatar
                src="https://i.pravatar.cc/150?img=33"
                sx={{ width: 36, height: 36 }}
              />
              <Box>
                <Typography
                  variant="caption"
                  sx={{ fontWeight: 700, display: "block" }}
                >
                  Marcus Vance
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "#44b700", fontWeight: 600 }}
                >
                  • Active Now
                </Typography>
              </Box>
            </Card>

            {/* Floating Component 2: Notification Card */}
            <Card
              elevation={4}
              sx={{
                position: "absolute",
                bottom: "10px",
                left: { xs: "-10px", sm: "-25px" },
                borderRadius: "16px",
                p: 1.5,
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                backgroundColor: "#FFFFFF",
                boxShadow: "0px 12px 24px rgba(0,0,0,0.08)",
                transition: "transform 0.3s ease",
                "&:hover": { transform: "translateY(-4px)" },
              }}
            >
              <Box
                sx={{
                  backgroundColor: "rgba(25, 118, 210, 0.1)",
                  borderRadius: "50%",
                  p: 1,
                  display: "flex",
                }}
              >
                <NotificationsIcon sx={{ color: "#1976D2" }} />
              </Box>
              <Box>
                <Typography
                  variant="caption"
                  sx={{ fontWeight: 700, display: "block" }}
                >
                  New Mention
                </Typography>
                <Typography variant="caption" sx={{ color: "#6B7280" }}>
                  Sarah tagged you in #general
                </Typography>
              </Box>
            </Card>

            {/* Floating Component 3: Emoji Reaction */}
            <Card
              elevation={4}
              sx={{
                position: "absolute",
                bottom: "30px",
                right: { xs: "-10px", sm: "-20px" },
                borderRadius: "20px",
                px: 2,
                py: 1,
                display: "flex",
                alignItems: "center",
                gap: 1,
                backgroundColor: "#FFFFFF",
                boxShadow: "0px 12px 24px rgba(0,0,0,0.08)",
                transition: "transform 0.3s ease",
                "&:hover": { transform: "scale(1.08)" },
              }}
            >
              <EmojiIcon sx={{ color: "#FFB300" }} />
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 700, color: "#1A1A1A" }}
              >
                Reaction 🔥 12
              </Typography>
            </Card>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
