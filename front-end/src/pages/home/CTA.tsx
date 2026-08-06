import React from "react";
import { Box, Container, Paper, Typography, Button } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { COLORS, glassStyle } from "../../styles";

export const CTA: React.FC = () => {
  return (
    <Box sx={{ py: { xs: 8, md: 12 }, position: "relative", zIndex: 1 }}>
      <Container maxWidth="md">
        <Paper
          elevation={0}
          sx={{
            ...glassStyle,
            p: { xs: 5, md: 8 },
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
            background:
              "radial-gradient(circle at center, rgba(124, 77, 255, 0.25) 0%, rgba(15, 23, 42, 0.8) 100%)",
            border: "1px solid rgba(0, 229, 255, 0.3)",
            boxShadow: "0 20px 60px rgba(124, 77, 255, 0.25)",
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "2rem", sm: "2.8rem" },
              color: "#FFFFFF",
              mb: 2,
            }}
          >
            Ready to Start Chatting?
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: COLORS.textSecondary,
              maxWidth: "550px",
              mx: "auto",
              mb: 4,
              fontSize: "1.1rem",
            }}
          >
            Join over 50,000+ happy users connecting effortlessly every single
            day. No credit card required.
          </Typography>

          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForwardIcon />}
            sx={{
              px: 5,
              py: 1.8,
              fontSize: "1.05rem",
              fontWeight: 700,
              borderRadius: "12px",
              textTransform: "none",
              background: "linear-gradient(135deg, #7C4DFF 0%, #00E5FF 100%)",
              boxShadow: "0 8px 30px rgba(0, 229, 255, 0.4)",
              "&:hover": {
                transform: "scale(1.04)",
                boxShadow: "0 12px 40px rgba(124, 77, 255, 0.6)",
              },
            }}
          >
            Create Free Account
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};
