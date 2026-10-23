import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Avatar,
  Badge,
  IconButton,
  TextField,
  InputAdornment,
  Chip,
  Tooltip,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { keyframes } from "@emotion/react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import SendIcon from "@mui/icons-material/Send";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import CallRoundedIcon from "@mui/icons-material/CallRounded";
import MicRoundedIcon from "@mui/icons-material/MicRounded";
import ReplyRoundedIcon from "@mui/icons-material/ReplyRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import DoneAllRoundedIcon from "@mui/icons-material/DoneAllRounded";
import { glassStyle, COLORS, GRADIENTS, gradientTextStyle } from "../../styles";
import { useNavigate } from "react-router-dom";
import { tokenKey } from "../../constants/common";
import { useLandingStats } from "./useLandingStats";

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(0, 229, 255, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(0, 229, 255, 0); }
  100% { box-shadow: 0 0 0 0 rgba(0, 229, 255, 0); }
`;

const bounce = keyframes`
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1.0); }
`;

/** Slow pan on the hero gradient headline. */
const shift = keyframes`
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
`;

/** Real product capabilities, mirroring the dashboard feature set. */
const HERO_CHIPS = [
  { label: "Real-time socket chat", icon: <BoltRoundedIcon sx={{ fontSize: 15 }} /> },
  { label: "Group chats & roles", icon: <GroupsRoundedIcon sx={{ fontSize: 15 }} /> },
  { label: "Audio & video calls", icon: <VideocamRoundedIcon sx={{ fontSize: 15 }} /> },
  { label: "Voice notes & files", icon: <MicRoundedIcon sx={{ fontSize: 15 }} /> },
  { label: "Replies & forwards", icon: <ReplyRoundedIcon sx={{ fontSize: 15 }} /> },
  { label: "Secure JWT auth", icon: <LockRoundedIcon sx={{ fontSize: 15 }} /> },
];

export const HeroSection: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();
  const { stats, isLive } = useLandingStats();
  const isAuthenticated = !!localStorage.getItem(tokenKey);

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
        <Grid container spacing={6} sx={{ alignItems: "center" }}>
          {/* Left Column */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ maxWidth: "560px" }}>
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1,
                  px: 2,
                  py: 0.8,
                  borderRadius: "30px",
                  backgroundColor: "rgba(124, 77, 255, 0.14)",
                  border: "1px solid rgba(124, 77, 255, 0.38)",
                  boxShadow: "0 0 26px rgba(124, 77, 255, 0.22)",
                  mb: 3,
                }}
              >
                <CheckCircleIcon sx={{ color: COLORS.secondary, fontSize: 18 }} />
                <Typography
                  variant="body2"
                  sx={{ color: "#E2E8F0", fontWeight: 600 }}
                >
                  Chats, groups, calls & files — one live workspace
                </Typography>
                <Chip
                  label={isLive ? "LIVE DATA" : "v2.0"}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: "0.65rem",
                    fontWeight: 800,
                    letterSpacing: "0.06em",
                    color: "#FFFFFF",
                    background: GRADIENTS.brand,
                    "& .MuiChip-label": { px: 1 },
                  }}
                />
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
                    ...gradientTextStyle,
                    background: GRADIENTS.brand,
                    backgroundSize: "220% 220%",
                    animation: `${shift} 9s ease infinite`,
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
                Real-time socket messaging, group chats with roles and
                invitations, HD audio & video calls, file and voice-note
                sharing, emoji reactions, replies and forwards — all inside a
                beautifully customisable workspace.
              </Typography>

              {/* Capability Chips (mirrors dashboard features) */}
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1,
                  mb: 3.5,
                  maxWidth: 560,
                }}
              >
                {HERO_CHIPS.map((chip) => (
                  <Chip
                    key={chip.label}
                    icon={chip.icon}
                    label={chip.label}
                    size="small"
                    sx={{
                      color: "#E2E8F0",
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      backdropFilter: "blur(8px)",
                      fontWeight: 600,
                      fontSize: "0.78rem",
                      "& .MuiChip-icon": { color: COLORS.secondary },
                      "&:hover": {
                        borderColor: "rgba(0, 229, 255, 0.5)",
                        backgroundColor: "rgba(0, 229, 255, 0.08)",
                      },
                    }}
                  />
                ))}
              </Box>

              {/* Action Buttons */}
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 6 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate(isAuthenticated ? "/chat" : "/SignUp")}
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
                  {isAuthenticated ? "Open Dashboard" : "Get Started Free"}
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate(isAuthenticated ? "/inviteUser" : "/login")}
                  startIcon={<LoginRoundedIcon />}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: "1rem",
                    fontWeight: 600,
                    borderRadius: "12px",
                    textTransform: "none",
                    borderColor: "rgba(255, 255, 255, 0.18)",
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
                  {isAuthenticated ? "Invite a Friend" : "Sign In"}
                </Button>
              </Box>

              {/* Live product stats (real dashboard API data when signed in) */}
              <Grid container spacing={3}>
                {stats.map((stat) => (
                  <Grid size={{ xs: 6, sm: 3 }} key={stat.id}>
                    <Box
                      sx={{
                        height: 3,
                        width: 34,
                        borderRadius: 2,
                        mb: 1.2,
                        background: GRADIENTS[stat.accent],
                      }}
                    />
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 800,
                        fontSize: { xs: "1.4rem", sm: "1.7rem" },
                        color: "#FFFFFF",
                        lineHeight: 1.1,
                      }}
                    >
                      {stat.value}
                      {stat.suffix}
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
          <Grid size={{ xs: 12, md: 6 }}>
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

                  {/* Call + menu actions — mirrors the dashboard chat header */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    {[
                      { label: "Voice call", icon: <CallRoundedIcon fontSize="small" /> },
                      { label: "Video call", icon: <VideocamRoundedIcon fontSize="small" /> },
                      { label: "More", icon: <MoreVertRoundedIcon fontSize="small" /> },
                    ].map((action) => (
                      <Tooltip key={action.label} title={action.label} arrow>
                        <IconButton
                          size="small"
                          sx={{
                            color: "rgba(255,255,255,0.7)",
                            "&:hover": {
                              color: "#FFFFFF",
                              backgroundColor: "rgba(0, 229, 255, 0.12)",
                            },
                          }}
                        >
                          {action.icon}
                        </IconButton>
                      </Tooltip>
                    ))}
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
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        gap: 0.5,
                        mr: 1,
                        mt: 0.25,
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          color: COLORS.textSecondary,
                          fontSize: "0.7rem",
                        }}
                      >
                        10:43 AM
                      </Typography>
                      <DoneAllRoundedIcon sx={{ fontSize: 15, color: COLORS.secondary }} />
                    </Box>
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

                <TextField
                  fullWidth
                  // value={message}
                  // onChange={(e) => setMessage(e.target.value)}
                  // onKeyDown={handleKeyPress}
                  placeholder="Type a message..."
                  variant="outlined"
                  size="small"
                  sx={{
                    "& .MuiInputBase-input::placeholder": {
                      color: "rgba(255, 255, 255, 0.5)",
                      opacity: 1,
                    },
                  }}
                  slotProps={{
                    input: {
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
                        "&.Mui-focused fieldset": {
                          borderColor: COLORS?.primary || "#3b82f6",
                        },
                      },
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                            // onClick={() => fileInputRef.current?.click()}
                            sx={{
                              color:
                                COLORS?.textSecondary ||
                                "rgba(255, 255, 255, 0.7)",
                            }}
                          >
                            <AttachFileIcon fontSize="small" />
                          </IconButton>

                          <IconButton
                            size="small"
                            // onClick={onEmojiClick}
                            sx={{
                              color:
                                COLORS?.textSecondary ||
                                "rgba(255, 255, 255, 0.7)",
                            }}
                          >
                            <SentimentSatisfiedAltIcon fontSize="small" />
                          </IconButton>

                          <IconButton
                            size="small"
                            // onClick={handleSend}
                            // disabled={!message.trim()}
                            sx={{
                              color: "#FFF",
                              backgroundColor: COLORS?.primary || "#3b82f6",
                              "&:hover": {
                                backgroundColor:
                                  COLORS?.primaryDark || "#2563eb",
                              },
                              "&.Mui-disabled": {
                                backgroundColor: "rgba(255, 255, 255, 0.12)",
                                color: "rgba(255, 255, 255, 0.3)",
                              },
                              ml: 0.5,
                            }}
                          >
                            <SendIcon fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
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
