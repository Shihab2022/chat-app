import React from "react";
import { Box, Container, Grid, Paper, Typography } from "@mui/material";
import BoltIcon from "@mui/icons-material/Bolt";
import SecurityIcon from "@mui/icons-material/Security";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import PublicIcon from "@mui/icons-material/Public";
import CloudSyncIcon from "@mui/icons-material/CloudSync";
import { SectionTitle } from "./SectionTitle";
import { glassStyle } from "../theme/theme";

const features = [
  {
    icon: <BoltIcon sx={{ fontSize: 32, color: "#00E5FF" }} />,
    title: "Real-time Messaging",
    description:
      "Sub-millisecond latency websocket infrastructure ensures your messages arrive instantaneously.",
  },
  {
    icon: <SecurityIcon sx={{ fontSize: 32, color: "#7C4DFF" }} />,
    title: "Secure Authentication",
    description:
      "End-to-end encryption protocols and robust OAuth integrations keep your conversations private.",
  },
  {
    icon: <EmojiEmotionsIcon sx={{ fontSize: 32, color: "#00E5FF" }} />,
    title: "Rich Emoji Support",
    description:
      "Express yourself fully with animated emojis, custom stickers, and rich media reactions.",
  },
  {
    icon: <PhoneIphoneIcon sx={{ fontSize: 32, color: "#7C4DFF" }} />,
    title: "Responsive Design",
    description:
      "Seamlessly switch between mobile, tablet, and desktop without losing your chat context.",
  },
  {
    icon: <PublicIcon sx={{ fontSize: 32, color: "#00E5FF" }} />,
    title: "Global Communication",
    description:
      "Edge servers distributed globally guarantee stable connections wherever you are.",
  },
  {
    icon: <CloudSyncIcon sx={{ fontSize: 32, color: "#7C4DFF" }} />,
    title: "Cloud Sync",
    description:
      "Instantaneous background synchronization guarantees your history is always up to date.",
  },
];

export const Features: React.FC = () => {
  return (
    <Box
      id="features"
      sx={{ py: { xs: 8, md: 12 }, position: "relative", zIndex: 1 }}
    >
      <Container maxWidth="lg">
        <SectionTitle
          badge="FEATURES"
          title="Why Choose Chatty"
          subtitle="Engineered for modern communication with cutting-edge speed, security, and delightful usability."
        />

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper
                elevation={0}
                sx={{
                  ...glassStyle,
                  p: 4,
                  height: "100%",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    borderColor: "rgba(0, 229, 255, 0.3)",
                    boxShadow: "0 12px 40px rgba(124, 77, 255, 0.2)",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: "16px",
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 3,
                  }}
                >
                  {feature.icon}
                </Box>
                <Typography
                  variant="h6"
                  sx={{ color: "#FFFFFF", fontWeight: 700, mb: 1.5 }}
                >
                  {feature.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", lineHeight: 1.6 }}
                >
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};
