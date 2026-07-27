import React from "react";
import { Box, Container, Typography, Card, Button, Stack } from "@mui/material";

export const CTASection: React.FC = () => {
  return (
    <Box
      component="section"
      aria-label="Call to Action"
      sx={{ py: { xs: 8, md: 10 }, backgroundColor: "#FFFFFF" }}
    >
      <Container maxWidth="lg">
        <Card
          elevation={0}
          sx={{
            borderRadius: "28px",
            p: { xs: 4, sm: 6, md: 8 },
            textAlign: "center",
            background: "linear-gradient(135deg, #1976D2 0%, #1565C0 100%)",
            color: "#FFFFFF",
            boxShadow: "0px 20px 40px rgba(25, 118, 210, 0.25)",
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "2.25rem", sm: "3rem", md: "3.5rem" },
              fontWeight: 800,
              mb: 2,
              letterSpacing: "-0.01em",
            }}
          >
            Ready to Start Chatting?
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: "1rem", sm: "1.25rem" },
              color: "rgba(255, 255, 255, 0.85)",
              mb: 4,
              maxWidth: "600px",
              mx: "auto",
            }}
          >
            Join thousands of active users and teams communicating securely in
            real time today.
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
          >
            <Button
              variant="contained"
              size="large"
              aria-label="Create New Account"
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: "12px",
                fontSize: "1rem",
                fontWeight: 700,
                textTransform: "none",
                backgroundColor: "#FFFFFF",
                color: "#1976D2",
                "&:hover": {
                  backgroundColor: "#F5F7FB",
                  transform: "scale(1.03)",
                },
              }}
            >
              Create Free Account
            </Button>
            <Button
              variant="outlined"
              size="large"
              aria-label="Sign In to Account"
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: "12px",
                fontSize: "1rem",
                fontWeight: 600,
                textTransform: "none",
                borderColor: "rgba(255, 255, 255, 0.5)",
                color: "#FFFFFF",
                "&:hover": {
                  borderColor: "#FFFFFF",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  transform: "scale(1.03)",
                },
              }}
            >
              Sign In
            </Button>
          </Stack>
        </Card>
      </Container>
    </Box>
  );
};
