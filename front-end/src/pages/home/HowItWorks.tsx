import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { STEPS_DATA } from "../../config/constants";

export const HowItWorks: React.FC = () => {
  return (
    <Box
      component="section"
      aria-label="How It Works"
      sx={{ py: { xs: 8, md: 12 }, backgroundColor: "#FFFFFF" }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: { xs: 6, md: 8 } }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
              fontWeight: 800,
              color: "#1A1A1A",
              mb: 2,
            }}
          >
            Get Started in 3 Simple Steps
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "#6B7280", fontSize: "1.125rem" }}
          >
            Joining millions of active users takes less than two minutes.
          </Typography>
        </Box>

        <Grid container spacing={4} sx={{ position: "relative" }}>
          {STEPS_DATA.map((step) => (
            <Grid key={step.id} item xs={12} md={4}>
              <Card
                elevation={0}
                sx={{
                  height: "100%",
                  borderRadius: "20px",
                  p: 3,
                  backgroundColor: "#F5F7FB",
                  position: "relative",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {/* Step Number Indicator Badge */}
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    backgroundColor: "#1976D2",
                    color: "#FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: "1.25rem",
                    mb: 2.5,
                    boxShadow: "0px 6px 16px rgba(25, 118, 210, 0.3)",
                  }}
                >
                  {step.stepNumber}
                </Box>

                <Box sx={{ color: "#1976D2", mb: 2 }}>{step.icon}</Box>

                <CardContent sx={{ p: 0 }}>
                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{ fontWeight: 700, color: "#1A1A1A", mb: 1.5 }}
                  >
                    {step.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#6B7280", lineHeight: 1.6 }}
                  >
                    {step.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};
