import React, { useState } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Paper,
  Avatar,
  Badge,
  IconButton,
  TextField,
  InputAdornment,
} from "@mui/material";
import { keyframes } from "@emotion/react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SendIcon from "@mui/icons-material/Send";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { glassStyle, COLORS } from "../../styles";

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(0, 229, 255, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(0, 229, 255, 0); }
  100% { box-shadow: 0 0 0 0 rgba(0, 229, 255, 0); }
`;

const bounce = keyframes`
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1.0); }
`;

export const HeroSection: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const x = (clientX / window.innerWidth - 0.5) * 20;
    const y = (clientY / window.innerHeight - 0.5) * 20;
    setMousePos({ x, y });
  };

  return (
    <Box
      onMouseMove={handleMouseMove}
      sx={{
        pt: { xs: 16, md: 22 },
        pb: { xs: 10, md: 16 },
        position: "relative",
        zIndex: 1,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          {/* Left Column */}
          <Grid item xs={12} md={6}>
            <Box sx={{ maxWidth: "560px" }}>
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1,
                  px: 2,
                  py: 0.8,
                  borderRadius: "30px",
                  backgroundColor: "rgba(124, 77, 255, 0.12)",
                  border: "1px solid rgba(124, 77, 255, 0.3)",
                  mb: 3,
                }}
              >
                <CheckCircleIcon
                  sx={{ color: COLORS.secondary, fontSize: 18 }}
                />
                <Typography
                  variant="body2"
                  sx={{ color: "#E2E8F0", fontWeight: 600 }}
                >
                  Chatty v2.0 is officially live!
                </Typography>
              </Box>

              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4rem" },
                  lineHeight: 1.1,
                  fontWeight: 800,
                  mb: 2.5,
                  color: "#FFFFFF",
                }}
              >
                Connect Instantly.{" "}
                <Box
                  component="span"
                  sx={{
                    background:
                      "linear-gradient(135deg, #7C4DFF 0%, #00E5FF 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    display: "inline-block",
                  }}
                >
                  Chat Without Limits.
                </Box>
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: COLORS.textSecondary,
                  fontSize: { xs: "1rem", sm: "1.15rem" },
                  lineHeight: 1.7,
                  mb: 4,
                }}
              >
                Experience lightning-fast real-time messaging, beautiful
                conversations, emoji support, secure authentication, and
                seamless global communication.
              </Typography>

              {/* Action Buttons */}
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 6 }}>
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: "1rem",
                    fontWeight: 700,
                    borderRadius: "12px",
                    textTransform: "none",
                    background:
                      "linear-gradient(135deg, #7C4DFF 0%, #00E5FF 100%)",
                    boxShadow: "0 8px 25px rgba(124, 77, 255, 0.4)",
                    "&:hover": {
                      transform: "translateY(-3px) scale(1.02)",
                      boxShadow: "0 12px 30px rgba(0, 229, 255, 0.5)",
                    },
                  }}
                >
                  Start Chatting
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: "1rem",
                    borderRadius: "12px",
                    textTransform: "none",
                    borderColor: "rgba(255, 255, 255, 0.15)",
                    color: "#FFFFFF",
                    backgroundColor: "rgba(255, 255, 255, 0.03)",
                    backdropFilter: "blur(10px)",
                    "&:hover": {
                      borderColor: COLORS.secondary,
                      backgroundColor: "rgba(0, 229, 255, 0.08)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  Learn More
                </Button>
              </Box>

              {/* Stats Bar */}
              <Grid container spacing={3}>
                {[
                  { value: "50K+", label: "Active Users" },
                  { value: "2M+", label: "Messages Daily" },
                  { value: "99.99%", label: "Uptime" },
                ].map((stat, idx) => (
                  <Grid item xs={4} key={idx}>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 800,
                        fontSize: { xs: "1.5rem", sm: "1.8rem" },
                        color: "#FFFFFF",
                      }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: COLORS.textSecondary, fontWeight: 500 }}
                    >
                      {stat.label}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>

          {/* Right Parallax Fake Chat UI */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                transform: `perspective(1000px) rotateY(${mousePos.x * -0.5}deg) rotateX(${
                  mousePos.y * 0.5
                }deg)`,
                transition: "transform 0.1s ease-out",
                position: "relative",
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  ...glassStyle,
                  p: 3,
                  maxWidth: "480px",
                  mx: "auto",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5)",
                }}
              >
                {/* Chat Header */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    pb: 2,
                    mb: 2.5,
                    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                      variant="dot"
                      sx={{
                        "& .MuiBadge-badge": {
                          backgroundColor: COLORS.secondary,
                          color: COLORS.secondary,
                          animation: `${pulse} 2s infinite`,
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                        },
                      }}
                    >
                      <Avatar
                        alt="Sarah Jenkins"
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
                      />
                    </Badge>
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 700, color: "#FFF" }}
                      >
                        Sarah Jenkins
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: COLORS.secondary }}
                      >
                        Active now
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Messages */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    mb: 3,
                  }}
                >
                  <Box sx={{ alignSelf: "flex-start", maxWidth: "80%" }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 1.5,
                        px: 2,
                        backgroundColor: "rgba(255, 255, 255, 0.08)",
                        borderRadius: "16px 16px 16px 4px",
                        color: "#F8FAFC",
                      }}
                    >
                      <Typography variant="body2">Hey 👋</Typography>
                    </Paper>
                    <Typography
                      variant="caption"
                      sx={{
                        color: COLORS.textSecondary,
                        fontSize: "0.7rem",
                        ml: 1,
                      }}
                    >
                      10:42 AM
                    </Typography>
                  </Box>

                  <Box sx={{ alignSelf: "flex-end", maxWidth: "80%" }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 1.5,
                        px: 2,
                        background:
                          "linear-gradient(135deg, #7C4DFF 0%, #651FFF 100%)",
                        borderRadius: "16px 16px 4px 16px",
                        color: "#FFF",
                        boxShadow: "0 4px 12px rgba(124, 77, 255, 0.3)",
                      }}
                    >
                      <Typography variant="body2">
                        Ready for today's meeting? 🚀
                      </Typography>
                    </Paper>
                    <Typography
                      variant="caption"
                      sx={{
                        color: COLORS.textSecondary,
                        fontSize: "0.7rem",
                        mr: 1,
                        display: "block",
                        textAlign: "right",
                      }}
                    >
                      10:43 AM
                    </Typography>
                  </Box>

                  <Box sx={{ alignSelf: "flex-start", maxWidth: "80%" }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 1.5,
                        px: 2,
                        backgroundColor: "rgba(255, 255, 255, 0.08)",
                        borderRadius: "16px 16px 16px 4px",
                        color: "#F8FAFC",
                      }}
                    >
                      <Typography variant="body2">Sure! Let's go 🎉</Typography>
                    </Paper>
                    <Typography
                      variant="caption"
                      sx={{
                        color: COLORS.textSecondary,
                        fontSize: "0.7rem",
                        ml: 1,
                      }}
                    >
                      10:43 AM
                    </Typography>
                  </Box>

                  {/* Typing Indicator */}
                  <Box
                    sx={{
                      alignSelf: "flex-start",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        p: 1.2,
                        px: 2,
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                        borderRadius: "16px",
                        display: "flex",
                        alignItems: "center",
                        gap: 0.6,
                      }}
                    >
                      {[0, 0.2, 0.4].map((delay, index) => (
                        <Box
                          key={index}
                          sx={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            backgroundColor: COLORS.secondary,
                            animation: `${bounce} 1.4s infinite ease-in-out both`,
                            animationDelay: `${delay}s`,
                          }}
                        />
                      ))}
                    </Paper>
                  </Box>
                </Box>

                {/* Input Area */}
                <TextField
                  fullWidth
                  placeholder="Type a message..."
                  variant="outlined"
                  size="small"
                  InputProps={{
                    sx: {
                      borderRadius: "12px",
                      backgroundColor: "rgba(15, 23, 42, 0.6)",
                      color: "#FFF",
                      fontSize: "0.9rem",
                      "& fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.1)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.2)",
                      },
                    },
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          sx={{ color: COLORS.textSecondary }}
                        >
                          <AttachFileIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          sx={{ color: COLORS.textSecondary }}
                        >
                          <SentimentSatisfiedAltIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          sx={{
                            color: "#FFF",
                            backgroundColor: COLORS.primary,
                            "&:hover": { backgroundColor: COLORS.primaryDark },
                            ml: 0.5,
                          }}
                        >
                          <SendIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
