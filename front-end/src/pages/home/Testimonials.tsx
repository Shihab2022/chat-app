import React, { useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Avatar,
  Rating,
  IconButton,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import { motion, AnimatePresence } from "framer-motion";
import { SectionTitle } from "../../components/SectionTitle";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  comment: string;
  accentColor: string;
}

const testimonials: Testimonial[] = [
  {
    id: 0,
    name: "Alex Rivera",
    role: "Lead Developer at TechCorp",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    rating: 5,
    comment:
      "Chatty has completely transformed how our remote engineering team communicates. The speed and stability are unmatched across all platforms.",
    accentColor: "#00E5FF",
  },
  {
    id: 1,
    name: "Sophia Chen",
    role: "Product Designer at Studio UI",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    rating: 5,
    comment:
      "The UI/UX is absolute perfection. It feels light, responsive, and aesthetically superior to traditional bloated business chat apps.",
    accentColor: "#7C4DFF",
  },
  {
    id: 2,
    name: "Marcus Vance",
    role: "Founder at StartupX",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    rating: 5,
    comment:
      "We switched 200+ team members over to Chatty in an afternoon. Seamless onboarding and our team genuinely loves using it every single day.",
    accentColor: "#FF4081",
  },
];

export const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
  };

  const activeItem = testimonials[currentIndex];

  return (
    <Box
      id="testimonials"
      sx={{ py: { xs: 8, md: 14 }, position: "relative", zIndex: 1 }}
    >
      <Container maxWidth="lg">
        <SectionTitle
          badge="TESTIMONIALS"
          title="Loved by Teams Worldwide"
          subtitle="Here is what founders, developers, and designers say about their experience with Chatty."
        />

        {/* Interactive Avatar Bar / Picker */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: { xs: 2, md: 3 },
            mt: 6,
            mb: 4,
          }}
        >
          {testimonials.map((item, index) => {
            const isActive = currentIndex === index;
            return (
              <Box
                key={item.id}
                onClick={() => setCurrentIndex(index)}
                sx={{
                  position: "relative",
                  cursor: "pointer",
                  p: "3px",
                  borderRadius: "50%",
                  background: isActive
                    ? `linear-gradient(135deg, ${item.accentColor}, #7C4DFF)`
                    : "transparent",
                  transition: "all 0.4s ease",
                  transform: isActive ? "scale(1.2)" : "scale(0.95)",
                  opacity: isActive ? 1 : 0.5,
                  "&:hover": {
                    opacity: 1,
                    transform: "scale(1.1)",
                  },
                }}
              >
                <Avatar
                  src={item.avatar}
                  alt={item.name}
                  sx={{ width: 54, height: 54 }}
                />
              </Box>
            );
          })}
        </Box>

        {/* Main Focused Testimonial Stage */}
        <Box sx={{ position: "relative", maxWidth: 850, mx: "auto", px: 2 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeItem.id}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 4, md: 6 },
                  borderRadius: "32px",
                  position: "relative",
                  backdropFilter: "blur(20px)",
                  background: `linear-gradient(145deg, rgba(255, 255, 255, 0.06) 0%, ${activeItem.accentColor}12 100%)`,
                  border: `1px solid ${activeItem.accentColor}40`,
                  boxShadow: `0 20px 50px ${activeItem.accentColor}20`,
                  textAlign: "center",
                }}
              >
                {/* Giant Ambient Quote Icon */}
                <FormatQuoteIcon
                  sx={{
                    position: "absolute",
                    top: 24,
                    left: 28,
                    fontSize: 80,
                    color: `${activeItem.accentColor}25`,
                    transform: "rotate(180deg)",
                  }}
                />

                {/* Rating Stars */}
                <Rating
                  value={activeItem.rating}
                  readOnly
                  sx={{
                    color: "#FBBF24",
                    mb: 3,
                    fontSize: "1.6rem",
                  }}
                />

                {/* Comment */}
                <Typography
                  variant="h6"
                  sx={{
                    color: "#FFFFFF",
                    fontWeight: 500,
                    lineHeight: 1.7,
                    fontSize: { xs: "1.1rem", md: "1.35rem" },
                    mb: 4,
                    px: { xs: 1, md: 4 },
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  "{activeItem.comment}"
                </Typography>

                {/* User Info */}
                <Box sx={{ display: "inline-block" }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: "#FFF",
                      fontSize: "1.1rem",
                    }}
                  >
                    {activeItem.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: activeItem.accentColor,
                      fontWeight: 600,
                      mt: 0.5,
                    }}
                  >
                    {activeItem.role}
                  </Typography>
                </Box>
              </Paper>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              position: "absolute",
              top: "50%",
              left: { xs: -10, md: -28 },
              right: { xs: -10, md: -28 },
              transform: "translateY(-50%)",
              pointerEvents: "none",
            }}
          >
            <IconButton
              onClick={handlePrev}
              sx={{
                pointerEvents: "auto",
                bgcolor: "rgba(255, 255, 255, 0.08)",
                color: "#FFF",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                backdropFilter: "blur(10px)",
                "&:hover": {
                  bgcolor: "rgba(255, 255, 255, 0.2)",
                  transform: "scale(1.1)",
                },
                transition: "all 0.3s ease",
              }}
            >
              <ArrowBackIosNewIcon sx={{ fontSize: 18 }} />
            </IconButton>

            <IconButton
              onClick={handleNext}
              sx={{
                pointerEvents: "auto",
                bgcolor: "rgba(255, 255, 255, 0.08)",
                color: "#FFF",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                backdropFilter: "blur(10px)",
                "&:hover": {
                  bgcolor: "rgba(255, 255, 255, 0.2)",
                  transform: "scale(1.1)",
                },
                transition: "all 0.3s ease",
              }}
            >
              <ArrowForwardIosIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>
        </Box>

        {/* Bottom Pagination Dots */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 1.5,
            mt: 5,
          }}
        >
          {testimonials.map((item, index) => (
            <Box
              key={item.id}
              onClick={() => setCurrentIndex(index)}
              sx={{
                width: currentIndex === index ? 32 : 10,
                height: 10,
                borderRadius: "10px",
                backgroundColor:
                  currentIndex === index
                    ? item.accentColor
                    : "rgba(255, 255, 255, 0.2)",
                cursor: "pointer",
                transition: "all 0.4s ease",
              }}
            />
          ))}
        </Box>
      </Container>
    </Box>
  );
};
