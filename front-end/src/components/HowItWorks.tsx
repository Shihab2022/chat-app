import React from "react";
import { Box, Container, Grid, Paper, Typography } from "@mui/material";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import RocketLaunchOutlinedIcon from "@mui/icons-material/RocketLaunchOutlined";
import { SectionTitle } from "./SectionTitle";
import { glassStyle } from "../theme/theme";

const steps = [
  {
    step: "01",
    title: "Create Account",
    description:
      "Sign up in seconds with Google or email. Quick, secure, and hassle-free.",
    icon: <PersonAddOutlinedIcon sx={{ fontSize: 28, color: "#00E5FF" }} />,
  },
  {
    step: "02",
    title: "Start Conversation",
    description:
      "Invite friends, join public spaces, or initiate private 1-on-1 direct channels.",
    icon: <ForumOutlinedIcon sx={{ fontSize: 28, color: "#7C4DFF" }} />,
  },
  {
    step: "03",
    title: "Enjoy Instant Messaging",
    description:
      "Share files, send voice messages, and express yourself in ultra-low latency.",
    icon: <RocketLaunchOutlinedIcon sx={{ fontSize: 28, color: "#00E5FF" }} />,
  },
];

export const HowItWorks: React.FC = () => {
  return (
    <Box
      id="how-it-works"
      sx={{ py: { xs: 8, md: 12 }, position: "relative", zIndex: 1 }}
    >
      <Container maxWidth="lg">
        <SectionTitle
          badge="WORKFLOW"
          title="Three Steps to Get Started"
          subtitle="Get set up and chatting with your team or community in less than two minutes."
        />

        <Box sx={{ position: "relative" }}>
          {/* Connecting line for desktop */}
          <Box
            sx={{
              display: { xs: "none", md: "block" },
              position: "absolute",
              top: "50%",
              left: "15%",
              right: "15%",
              height: "2px",
              background: "linear-gradient(90deg, #7C4DFF 0%, #00E5FF 100%)",
              zIndex: 0,
              transform: "translateY(-50%)",
              opacity: 0.4,
            }}
          />

          <Grid container spacing={4} sx={{ position: "relative", zIndex: 1 }}>
            {steps.map((item, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    ...glassStyle,
                    p: 4,
                    textAlign: "center",
                    height: "100%",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      borderColor: "rgba(124, 77, 255, 0.4)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      background:
                        "linear-gradient(135deg, #7C4DFF 0%, #00E5FF 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      mb: 2.5,
                      boxShadow: "0 4px 20px rgba(124, 77, 255, 0.4)",
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Typography
                    variant="overline"
                    sx={{
                      color: "secondary.main",
                      fontWeight: 800,
                      letterSpacing: 2,
                      display: "block",
                      mb: 1,
                    }}
                  >
                    STEP {item.step}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ color: "#FFF", fontWeight: 700, mb: 1.5 }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", lineHeight: 1.6 }}
                  >
                    {item.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};
