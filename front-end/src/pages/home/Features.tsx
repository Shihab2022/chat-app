import React, { useState, useEffect, useRef } from "react";
import { Box, Container, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { motion } from "framer-motion";
import BoltIcon from "@mui/icons-material/Bolt";
import SecurityIcon from "@mui/icons-material/Security";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import PublicIcon from "@mui/icons-material/Public";
import CloudSyncIcon from "@mui/icons-material/CloudSync";
import { COLORS } from "../../styles";
import { SectionTitle } from "../../components/SectionTitle";

interface Feature {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    id: "feature-0",
    icon: <BoltIcon sx={{ fontSize: 28 }} />,
    title: "Real-time Messaging",
    description:
      "Sub-millisecond latency websocket infrastructure ensures your messages arrive instantaneously.",
  },
  {
    id: "feature-1",
    icon: <SecurityIcon sx={{ fontSize: 28 }} />,
    title: "Secure Authentication",
    description:
      "End-to-end encryption protocols and robust OAuth integrations keep your conversations private.",
  },
  {
    id: "feature-2",
    icon: <EmojiEmotionsIcon sx={{ fontSize: 28 }} />,
    title: "Rich Emoji Support",
    description:
      "Express yourself fully with animated emojis, custom stickers, and rich media reactions.",
  },
  {
    id: "feature-3",
    icon: <PhoneIphoneIcon sx={{ fontSize: 28 }} />,
    title: "Responsive Design",
    description:
      "Seamlessly switch between mobile, tablet, and desktop without losing your chat context.",
  },
  {
    id: "feature-4",
    icon: <PublicIcon sx={{ fontSize: 28 }} />,
    title: "Global Communication",
    description:
      "Edge servers distributed globally guarantee stable connections wherever you are.",
  },
  {
    id: "feature-5",
    icon: <CloudSyncIcon sx={{ fontSize: 28 }} />,
    title: "Cloud Sync",
    description:
      "Instantaneous background synchronization guarantees your history is always up to date.",
  },
];

export const Features: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observerOptions: IntersectionObserverInit = {
      root: null,
      // Focus activation zone around mid-screen with smooth scroll entry
      rootMargin: "-40% 0px -40% 0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = Number(entry.target.getAttribute("data-index"));
          if (!isNaN(index)) {
            setActiveIndex(index);
          }
        }
      });
    }, observerOptions);

    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

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

        <Box sx={{ mt: 10, position: "relative" }}>
          {features.map((feature, index) => {
            const isEven = index % 2 === 0;
            const isActive = activeIndex === index;
            const hasNext = index < features.length - 1;

            return (
              <Box key={feature.id} sx={{ position: "relative" }}>
                <Grid
                  container
                  spacing={4}
                  sx={{
                    mb: { xs: 8, md: 14 },
                    position: "relative",
                    zIndex: 2,
                    alignItems: "center",
                    flexDirection: {
                      xs: "column",
                      md: isEven ? "row" : "row-reverse",
                    },
                  }}
                >
                  {/* Card Section */}
                  <Grid sx={{ xs: 12, md: 6 }}>
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                    >
                      <Box
                        ref={(el: HTMLDivElement | null) => {
                          cardRefs.current[index] = el;
                        }}
                        data-index={index}
                        sx={{
                          position: "relative",
                          p: { xs: 3.5, md: 4.5 },
                          pt: { xs: 5, md: 5 },
                          borderRadius: "24px",
                          // Smooth linear gradient background transition
                          background: isActive
                            ? "linear-gradient(135deg, #7C3AED 0%, #4C1D95 100%)"
                            : "linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)",
                          border: isActive
                            ? "1px solid #A78BFA"
                            : "1px solid rgba(255, 255, 255, 0.08)",
                          boxShadow: isActive
                            ? "0 20px 50px rgba(124, 58, 237, 0.35)"
                            : "0 10px 30px rgba(0, 0, 0, 0.2)",
                          // Fluid transition delay effect for smooth state updates
                          transition:
                            "background 0.7s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.7s ease, box-shadow 0.7s ease, transform 0.5s ease",
                          transform: isActive
                            ? "translateY(-6px) scale(1.02)"
                            : "none",
                        }}
                      >
                        {/* Corner Floating Icon Badge */}
                        <Box
                          sx={{
                            position: "absolute",
                            top: -26,
                            left: isEven ? 32 : { xs: 32, md: "auto" },
                            right: isEven ? "auto" : { xs: "auto", md: 32 },
                            width: 52,
                            height: 52,
                            borderRadius: "14px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                            backgroundColor: isActive ? "#F59E0B" : "#1E293B",
                            color: isActive ? "#FFFFFF" : "#94A3B8",
                            border: `2px solid ${isActive ? "#FBBF24" : "rgba(255, 255, 255, 0.15)"}`,
                            boxShadow: isActive
                              ? "0 10px 25px rgba(245, 158, 11, 0.45)"
                              : "none",
                            zIndex: 3,
                          }}
                        >
                          {feature.icon}
                        </Box>

                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            color: "#FFFFFF",
                            mb: 1.5,
                            fontSize: "1.25rem",
                          }}
                        >
                          {feature.title}
                        </Typography>

                        <Typography
                          variant="body2"
                          sx={{
                            color: isActive
                              ? "rgba(255, 255, 255, 0.9)"
                              : COLORS.textSecondary ||
                                "rgba(255, 255, 255, 0.6)",
                            lineHeight: 1.7,
                            fontSize: "0.95rem",
                            transition: "color 0.6s ease",
                          }}
                        >
                          {feature.description}
                        </Typography>
                      </Box>
                    </motion.div>
                  </Grid>

                  {/* Empty Spacer Column for Alignment */}
                  <Grid sx={{ xs: 12, md: 6 }} />
                </Grid>

                {/* Curved Zigzag Connector Line between Left and Right Cards */}
                {hasNext && (
                  <Box
                    sx={{
                      display: { xs: "none", md: "block" },
                      position: "absolute",
                      top: "50%",
                      left: 0,
                      width: "100%",
                      height: "100%",
                      pointerEvents: "none",
                      zIndex: 1,
                    }}
                  >
                    <svg
                      width="100%"
                      height="100%"
                      viewBox="0 0 1000 200"
                      preserveAspectRatio="none"
                      style={{ overflow: "visible" }}
                    >
                      <path
                        d={
                          isEven
                            ? "M 250, 0 C 250, 100 750, 100 750, 200"
                            : "M 750, 0 C 750, 100 250, 100 250, 200"
                        }
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.12)"
                        strokeWidth="2"
                        strokeDasharray="6 6"
                      />
                      {/* Active glowing path overlay when reaching this section */}
                      {isActive && (
                        <motion.path
                          d={
                            isEven
                              ? "M 250, 0 C 250, 100 750, 100 750, 200"
                              : "M 750, 0 C 750, 100 250, 100 250, 200"
                          }
                          fill="none"
                          stroke="#7C3AED"
                          strokeWidth="3"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 1.2, ease: "easeInOut" }}
                        />
                      )}
                    </svg>
                  </Box>
                )}
              </Box>
            );
          })}
        </Box>
      </Container>
    </Box>
  );
};
