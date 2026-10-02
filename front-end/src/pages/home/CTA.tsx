import React from "react";
import { Box, Container, Paper, Typography, Button, Chip, Stack } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import { COLORS, GRADIENTS, glassStyle, gradientTextStyle } from "../../styles";
import { useNavigate } from "react-router-dom";
import { tokenKey } from "../../constants/common";

const PERKS = [
  { label: "Real-time sockets", icon: <BoltRoundedIcon sx={{ fontSize: 15 }} /> },
  { label: "Group chats & calls", icon: <GroupsRoundedIcon sx={{ fontSize: 15 }} /> },
  { label: "Secure JWT auth", icon: <LockRoundedIcon sx={{ fontSize: 15 }} /> },
];

export const CTA: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem(tokenKey);
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
            Ready to start{" "}
            <Box component="span" sx={gradientTextStyle}>
              chatting?
            </Box>
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: COLORS.textSecondary,
              maxWidth: "560px",
              mx: "auto",
              mb: 3,
              fontSize: "1.1rem",
            }}
          >
            Bring your chats, groups, calls and files into one modern workspace.
            No credit card required — your first conversation is seconds away.
          </Typography>

          {/* Feature reassurance chips */}
          <Stack
            direction="row"
            spacing={1}
            sx={{
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 1,
              mb: 4,
            }}
          >
            {PERKS.map((perk) => (
              <Chip
                key={perk.label}
                icon={perk.icon}
                label={perk.label}
                size="small"
                sx={{
                  color: "#E2E8F0",
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  fontWeight: 600,
                  fontSize: "0.78rem",
                  "& .MuiChip-icon": { color: COLORS.secondary },
                }}
              />
            ))}
          </Stack>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{ justifyContent: "center", alignItems: "stretch" }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate(isAuthenticated ? "/chat" : "/SignUp")}
              endIcon={<ArrowForwardIcon />}
              sx={{
                px: 5,
                py: 1.8,
                fontSize: "1.05rem",
                fontWeight: 700,
                borderRadius: "12px",
                textTransform: "none",
                background: GRADIENTS.brand,
                boxShadow: "0 8px 30px rgba(0, 229, 255, 0.4)",
                "&:hover": {
                  transform: "scale(1.04)",
                  boxShadow: "0 12px 40px rgba(124, 77, 255, 0.6)",
                },
              }}
            >
              {isAuthenticated ? "Open Dashboard" : "Create Free Account"}
            </Button>

            {!isAuthenticated && (
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate("/login")}
                startIcon={<LoginRoundedIcon />}
                sx={{
                  px: 4,
                  py: 1.8,
                  fontSize: "1.05rem",
                  fontWeight: 600,
                  borderRadius: "12px",
                  textTransform: "none",
                  color: "#FFFFFF",
                  borderColor: "rgba(255, 255, 255, 0.22)",
                  "&:hover": {
                    borderColor: COLORS.secondary,
                    backgroundColor: "rgba(0, 229, 255, 0.08)",
                    transform: "scale(1.04)",
                  },
                }}
              >
                Sign In
              </Button>
            )}
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};
