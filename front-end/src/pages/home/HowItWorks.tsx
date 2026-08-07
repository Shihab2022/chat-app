import React, { useState, useEffect, useRef } from "react";
import { Box, Container, Typography, Paper } from "@mui/material";
import Grid from "@mui/material/Grid";
import { motion } from "framer-motion";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import RocketLaunchOutlinedIcon from "@mui/icons-material/RocketLaunchOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { COLORS } from "../../styles";
import { SectionTitle } from "../../components/SectionTitle";

interface StepItem {
  id: string;
  step: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  accentColor: string;
}

const steps: StepItem[] = [
  {
    id: "step-1",
    step: "01",
    title: "Create Account",
    description:
      "Sign up in seconds with Google or email. Quick, secure, and hassle-free onboarding.",
    icon: <PersonAddOutlinedIcon sx={{ fontSize: 28 }} />,
    accentColor: "#00E5FF",
  },
  {
    id: "step-2",
    step: "02",
    title: "Start Conversation",
    description:
      "Invite friends, join public channels, or initiate private 1-on-1 direct channels instantly.",
    icon: <ForumOutlinedIcon sx={{ fontSize: 28 }} />,
    accentColor: "#7C4DFF",
  },
  {
    id: "step-3",
    step: "03",
    title: "Enjoy Instant Messaging",
    description:
      "Share files, send voice messages, and express yourself with sub-millisecond latency.",
    icon: <RocketLaunchOutlinedIcon sx={{ fontSize: 28 }} />,
    accentColor: "#FF4081",
  },
];

export const HowItWorks: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Auto-cycle through steps or sync on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      if (rect.top <= viewportHeight * 0.6 && rect.bottom >= 0) {
        const progress = Math.max(
          0,
          Math.min(1, (viewportHeight * 0.6 - rect.top) / rect.height),
        );
        const index = Math.min(
          steps.length - 1,
          Math.floor(progress * steps.length),
        );
        setActiveStep(index);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Box
      id="how-it-works"
      ref={containerRef}
      sx={{ py: { xs: 8, md: 14 }, position: "relative", zIndex: 1 }}
    >
      <Container maxWidth="lg">
        <SectionTitle
          badge="WORKFLOW"
          title="Three Steps to Get Started"
          subtitle="Get set up and chatting with your team or community in less than two minutes."
        />

        {/* Top Horizontal Step Selector / Progress Bar */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: { xs: 2, md: 4 },
            my: { xs: 6, md: 8 },
            position: "relative",
          }}
        >
          {steps.map((item, index) => {
            const isActive = activeStep === index;
            const isCompleted = activeStep > index;

            return (
              <React.Fragment key={item.id}>
                <Box
                  onClick={() => setActiveStep(index)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    cursor: "pointer",
                    px: { xs: 2, md: 3 },
                    py: 1.2,
                    borderRadius: "50px",
                    background: isActive
                      ? "rgba(124, 77, 255, 0.15)"
                      : "rgba(255, 255, 255, 0.03)",
                    border: `1px solid ${
                      isActive ? item.accentColor : "rgba(255, 255, 255, 0.08)"
                    }`,
                    transition: "all 0.4s ease",
                    "&:hover": {
                      background: "rgba(255, 255, 255, 0.08)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.85rem",
                      fontWeight: 800,
                      backgroundColor: isActive
                        ? item.accentColor
                        : isCompleted
                          ? "#10B981"
                          : "rgba(255, 255, 255, 0.1)",
                      color: isActive || isCompleted ? "#000" : "#FFF",
                      transition: "all 0.4s ease",
                    }}
                  >
                    {isCompleted ? (
                      <CheckCircleIcon sx={{ fontSize: 18 }} />
                    ) : (
                      item.step
                    )}
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 700,
                      color: isActive ? "#FFF" : "rgba(255, 255, 255, 0.5)",
                      display: { xs: "none", sm: "block" },
                      transition: "color 0.3s ease",
                    }}
                  >
                    {item.title}
                  </Typography>
                </Box>

                {/* Connector Arrow */}
                {index < steps.length - 1 && (
                  <Box
                    sx={{
                      color:
                        activeStep > index
                          ? "#10B981"
                          : "rgba(255, 255, 255, 0.2)",
                      display: "flex",
                      alignItems: "center",
                      transition: "color 0.4s ease",
                    }}
                  >
                    <ArrowForwardIcon sx={{ fontSize: 20 }} />
                  </Box>
                )}
              </React.Fragment>
            );
          })}
        </Box>

        {/* Bottom Horizontal Card Grid */}
        <Grid container spacing={4} sx={{ justifyContent: "center" }}>
          {steps.map((item, index) => {
            const isActive = activeStep === index;

            return (
              <Grid sx={{ xs: 12, md: 4 }} key={item.id}>
                <motion.div
                  animate={{
                    scale: isActive ? 1.03 : 0.97,
                    y: isActive ? -8 : 0,
                  }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <Paper
                    onClick={() => setActiveStep(index)}
                    elevation={0}
                    sx={{
                      p: 4,
                      borderRadius: "24px",
                      cursor: "pointer",
                      height: "100%",
                      position: "relative",
                      overflow: "hidden",
                      backdropFilter: "blur(12px)",
                      background: isActive
                        ? `linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, ${item.accentColor}1A 100%)`
                        : "rgba(255, 255, 255, 0.02)",
                      border: `1px solid ${
                        isActive
                          ? item.accentColor
                          : "rgba(255, 255, 255, 0.06)"
                      }`,
                      boxShadow: isActive
                        ? `0 20px 40px ${item.accentColor}25`
                        : "none",
                      transition:
                        "background 0.5s ease, border-color 0.5s ease, box-shadow 0.5s ease",
                    }}
                  >
                    {/* Top Glow Accent Bar */}
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "4px",
                        backgroundColor: isActive
                          ? item.accentColor
                          : "transparent",
                        transition: "background-color 0.4s ease",
                      }}
                    />

                    {/* Step Number & Icon */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mb: 3,
                      }}
                    >
                      <Box
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: "16px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: isActive
                            ? `${item.accentColor}25`
                            : "rgba(255, 255, 255, 0.05)",
                          color: isActive ? item.accentColor : "#94A3B8",
                          border: `1px solid ${
                            isActive
                              ? item.accentColor
                              : "rgba(255, 255, 255, 0.1)"
                          }`,
                          transition: "all 0.4s ease",
                        }}
                      >
                        {item.icon}
                      </Box>
                      <Typography
                        variant="h3"
                        sx={{
                          fontWeight: 900,
                          fontSize: "2rem",
                          color: isActive
                            ? item.accentColor
                            : "rgba(255, 255, 255, 0.15)",
                          transition: "color 0.4s ease",
                        }}
                      >
                        {item.step}
                      </Typography>
                    </Box>

                    {/* Card Content */}
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: "#FFFFFF",
                        mb: 1.5,
                      }}
                    >
                      {item.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        color: isActive
                          ? "rgba(255, 255, 255, 0.85)"
                          : COLORS.textSecondary || "rgba(255, 255, 255, 0.5)",
                        lineHeight: 1.7,
                        transition: "color 0.4s ease",
                      }}
                    >
                      {item.description}
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
};
