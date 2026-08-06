import React from "react";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Avatar,
  Rating,
} from "@mui/material";
import { SectionTitle } from "../../components/SectionTitle";
import { COLORS, glassStyle } from "../../styles";

const testimonials = [
  {
    name: "Alex Rivera",
    role: "Lead Developer at TechCorp",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    rating: 5,
    comment:
      "Chatty has completely transformed how our remote engineering team communicates. The speed and stability are unmatched.",
  },
  {
    name: "Sophia Chen",
    role: "Product Designer at Studio UI",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    rating: 5,
    comment:
      "The UI/UX is absolute perfection. It feels light, responsive, and aesthetically superior to traditional business chat apps.",
  },
  {
    name: "Marcus Vance",
    role: "Founder at StartupX",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    rating: 5,
    comment:
      "We switched 200+ team members over to Chatty in an afternoon. Seamless onboarding and our team genuinely loves using it.",
  },
];

export const Testimonials: React.FC = () => {
  return (
    <Box
      id="testimonials"
      sx={{ py: { xs: 8, md: 12 }, position: "relative", zIndex: 1 }}
    >
      <Container maxWidth="lg">
        <SectionTitle
          badge="TESTIMONIALS"
          title="Loved by Teams Worldwide"
          subtitle="Here is what founders, developers, and designers say about their experience with Chatty."
        />

        <Grid container spacing={4}>
          {testimonials.map((item, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper
                elevation={0}
                sx={{
                  ...glassStyle,
                  p: 4,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-6px)",
                  },
                }}
              >
                <Box sx={{ mb: 3 }}>
                  <Rating
                    value={item.rating}
                    readOnly
                    sx={{ color: COLORS.secondary, mb: 2 }}
                  />
                  <Typography
                    variant="body1"
                    sx={{
                      color: COLORS.textPrimary,
                      fontStyle: "italic",
                      lineHeight: 1.6,
                    }}
                  >
                    "{item.comment}"
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar
                    src={item.avatar}
                    alt={item.name}
                    sx={{ width: 48, height: 48 }}
                  />
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 700, color: "#FFF" }}
                    >
                      {item.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: COLORS.textSecondary }}
                    >
                      {item.role}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};
