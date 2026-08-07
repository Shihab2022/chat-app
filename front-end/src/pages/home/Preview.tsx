import React, { useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Avatar,
  IconButton,
  Chip,
  Tabs,
  Tab,
} from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import SearchIcon from "@mui/icons-material/Search";
import SendIcon from "@mui/icons-material/Send";
import PhoneIcon from "@mui/icons-material/Phone";
import VideocamIcon from "@mui/icons-material/Videocam";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import DesktopWindowsIcon from "@mui/icons-material/DesktopWindows";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import TabletMacIcon from "@mui/icons-material/TabletMac";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import SecurityIcon from "@mui/icons-material/Security";
import { motion, AnimatePresence } from "framer-motion";
import { SectionTitle } from "../../components/SectionTitle";
import { COLORS } from "../../styles";

export const Preview: React.FC = () => {
  const [deviceTab, setDeviceTab] = useState<number>(0);
  const [activeChannel, setActiveChannel] = useState<string>("General Team");

  // Dynamic layout dimensions based on selected tab
  const getContainerWidth = () => {
    switch (deviceTab) {
      case 1:
        return "380px"; // Mobile
      case 2:
        return "680px"; // Tablet
      default:
        return "1000px"; // Desktop
    }
  };

  return (
    <Box
      id="preview"
      sx={{ py: { xs: 8, md: 14 }, position: "relative", zIndex: 1 }}
    >
      <Container maxWidth="lg">
        <SectionTitle
          badge="INTERFACE PREVIEW"
          title="Beautiful Across Every Device"
          subtitle="Immerse yourself in an ultra-clean layout crafted for clarity and effortless navigation."
        />

        {/* Device Switcher Tabs */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 6,
          }}
        >
          <Box
            sx={{
              p: 0.8,
              borderRadius: "50px",
              backgroundColor: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(12px)",
            }}
          >
            <Tabs
              value={deviceTab}
              onChange={(_, newValue) => setDeviceTab(newValue)}
              sx={{
                minHeight: "auto",
                "& .MuiTabs-indicator": {
                  height: "100%",
                  borderRadius: "50px",
                  backgroundColor: "rgba(124, 77, 255, 0.25)",
                  border: "1px solid #7C4DFF",
                  zIndex: 0,
                },
              }}
            >
              <Tab
                icon={<DesktopWindowsIcon sx={{ fontSize: 18 }} />}
                iconPosition="start"
                label="Desktop"
                sx={{
                  color: "rgba(255,255,255,0.6)",
                  "&.Mui-selected": { color: "#FFF" },
                  minHeight: 40,
                  px: 3,
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  zIndex: 1,
                }}
              />
              <Tab
                icon={<TabletMacIcon sx={{ fontSize: 18 }} />}
                iconPosition="start"
                label="Tablet"
                sx={{
                  color: "rgba(255,255,255,0.6)",
                  "&.Mui-selected": { color: "#FFF" },
                  minHeight: 40,
                  px: 3,
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  zIndex: 1,
                }}
              />
              <Tab
                icon={<PhoneIphoneIcon sx={{ fontSize: 18 }} />}
                iconPosition="start"
                label="Mobile"
                sx={{
                  color: "rgba(255,255,255,0.6)",
                  "&.Mui-selected": { color: "#FFF" },
                  minHeight: 40,
                  px: 3,
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  zIndex: 1,
                }}
              />
            </Tabs>
          </Box>
        </Box>

        {/* Main Stage with Floating Badges */}
        <Box
          sx={{
            position: "relative",
            perspective: "1200px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {/* Floating Badge Left */}
          <Paper
            component={motion.div}
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            elevation={0}
            sx={{
              display: { xs: "none", lg: "flex" },
              alignItems: "center",
              gap: 1.5,
              position: "absolute",
              top: "15%",
              left: -20,
              zIndex: 3,
              p: 2,
              borderRadius: "16px",
              background: "rgba(15, 23, 42, 0.85)",
              border: "1px solid rgba(0, 229, 255, 0.3)",
              backdropFilter: "blur(16px)",
              boxShadow: "0 15px 35px rgba(0,229,255,0.15)",
            }}
          >
            <FlashOnIcon sx={{ color: "#00E5FF" }} />
            <Box>
              <Typography
                variant="caption"
                sx={{ color: "#FFF", fontWeight: 700, display: "block" }}
              >
                Ultra Low Latency
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "rgba(255,255,255,0.5)" }}
              >
                &lt;10ms Message Sync
              </Typography>
            </Box>
          </Paper>

          {/* Floating Badge Right */}
          <Paper
            component={motion.div}
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            elevation={0}
            sx={{
              display: { xs: "none", lg: "flex" },
              alignItems: "center",
              gap: 1.5,
              position: "absolute",
              bottom: "15%",
              right: -20,
              zIndex: 3,
              p: 2,
              borderRadius: "16px",
              background: "rgba(15, 23, 42, 0.85)",
              border: "1px solid rgba(255, 64, 129, 0.3)",
              backdropFilter: "blur(16px)",
              boxShadow: "0 15px 35px rgba(255,64,129,0.15)",
            }}
          >
            <SecurityIcon sx={{ color: "#FF4081" }} />
            <Box>
              <Typography
                variant="caption"
                sx={{ color: "#FFF", fontWeight: 700, display: "block" }}
              >
                End-to-End Encrypted
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "rgba(255,255,255,0.5)" }}
              >
                256-bit AES Protection
              </Typography>
            </Box>
          </Paper>

          {/* 3D Glass App Container */}
          <motion.div
            animate={{
              width: getContainerWidth(),
              rotateX: deviceTab === 0 ? 4 : 0,
            }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            style={{ width: "100%", maxWidth: "100%" }}
          >
            <Paper
              elevation={0}
              sx={{
                p: { xs: 1, sm: 1.5 },
                borderRadius: "24px",
                overflow: "hidden",
                backdropFilter: "blur(20px)",
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(124,77,255,0.05) 100%)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                boxShadow:
                  "0 30px 80px rgba(0, 0, 0, 0.8), 0 0 40px rgba(124, 77, 255, 0.15)",
                transition: "box-shadow 0.5s ease",
              }}
            >
              {/* Window Header / Traffic Lights */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  px: 2,
                  py: 1,
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  <CircleIcon sx={{ fontSize: 12, color: "#FF5F56" }} />
                  <CircleIcon sx={{ fontSize: 12, color: "#FFBD2E" }} />
                  <CircleIcon sx={{ fontSize: 12, color: "#27C93F" }} />
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: "rgba(255,255,255,0.4)",
                    fontWeight: 600,
                    letterSpacing: 0.5,
                  }}
                >
                  Chatty Desktop v2.4
                </Typography>
                <Chip
                  label="LIVE DEMO"
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: "0.65rem",
                    fontWeight: 800,
                    backgroundColor: "rgba(16, 185, 129, 0.2)",
                    color: "#10B981",
                    border: "1px solid rgba(16, 185, 129, 0.4)",
                  }}
                />
              </Box>

              {/* Chat App Workspace */}
              <Box
                sx={{
                  display: "flex",
                  height: deviceTab === 1 ? "520px" : "480px",
                  borderRadius: "16px",
                  backgroundColor: "rgba(10, 15, 30, 0.9)",
                  overflow: "hidden",
                  mt: 1,
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                }}
              >
                {/* Sidebar (Hidden on mobile tab) */}
                <AnimatePresence>
                  {deviceTab !== 1 && (
                    <Box
                      component={motion.div}
                      initial={{ width: 0, opacity: 0 }}
                      animate={{
                        width: deviceTab === 2 ? "180px" : "240px",
                        opacity: 1,
                      }}
                      exit={{ width: 0, opacity: 0 }}
                      sx={{
                        borderRight: "1px solid rgba(255, 255, 255, 0.08)",
                        p: 2,
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        backgroundColor: "rgba(15, 23, 42, 0.6)",
                      }}
                    >
                      {/* Search Bar */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          px: 1.5,
                          py: 1,
                          borderRadius: "10px",
                          backgroundColor: "rgba(255, 255, 255, 0.04)",
                          border: "1px solid rgba(255, 255, 255, 0.06)",
                          color:
                            COLORS.textSecondary || "rgba(255, 255, 255, 0.5)",
                        }}
                      >
                        <SearchIcon sx={{ fontSize: 18 }} />
                        <Typography
                          variant="caption"
                          sx={{ color: "rgba(255,255,255,0.4)" }}
                        >
                          Search...
                        </Typography>
                      </Box>

                      {/* Channels List */}
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 0.5,
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            color: "rgba(255, 255, 255, 0.3)",
                            fontWeight: 700,
                            px: 1,
                            mb: 0.5,
                            fontSize: "0.65rem",
                            letterSpacing: 1,
                          }}
                        >
                          CHANNELS
                        </Typography>

                        {[
                          { name: "General Team", badge: "3" },
                          { name: "Design Sprint" },
                          { name: "Product Launch" },
                        ].map((chat) => {
                          const isActive = activeChannel === chat.name;
                          return (
                            <Box
                              key={chat.name}
                              onClick={() => setActiveChannel(chat.name)}
                              sx={{
                                p: 1.2,
                                borderRadius: "10px",
                                backgroundColor: isActive
                                  ? "rgba(124, 77, 255, 0.2)"
                                  : "transparent",
                                border: isActive
                                  ? "1px solid rgba(124, 77, 255, 0.4)"
                                  : "1px solid transparent",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                                "&:hover": {
                                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                                },
                              }}
                            >
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: isActive ? 700 : 500,
                                  color: isActive
                                    ? "#FFF"
                                    : "rgba(255, 255, 255, 0.6)",
                                  fontSize: "0.82rem",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                # {chat.name}
                              </Typography>
                              {chat.badge && (
                                <Box
                                  sx={{
                                    px: 0.8,
                                    py: 0.1,
                                    borderRadius: "10px",
                                    backgroundColor: "#00E5FF",
                                    color: "#000",
                                    fontSize: "0.68rem",
                                    fontWeight: 800,
                                  }}
                                >
                                  {chat.badge}
                                </Box>
                              )}
                            </Box>
                          );
                        })}
                      </Box>
                    </Box>
                  )}
                </AnimatePresence>

                {/* Main Active Chat Area */}
                <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                  {/* Chat Header */}
                  <Box
                    sx={{
                      px: 3,
                      py: 1.5,
                      borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      backgroundColor: "rgba(15, 23, 42, 0.4)",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 700, color: "#FFF" }}
                      >
                        # {activeChannel}
                      </Typography>
                      <CircleIcon sx={{ fontSize: 8, color: "#10B981" }} />
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        color: "rgba(255, 255, 255, 0.6)",
                      }}
                    >
                      <IconButton size="small" sx={{ color: "inherit" }}>
                        <PhoneIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" sx={{ color: "inherit" }}>
                        <VideocamIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" sx={{ color: "inherit" }}>
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Messages Feed */}
                  <Box
                    sx={{
                      flex: 1,
                      p: 2.5,
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                      overflowY: "auto",
                    }}
                  >
                    {/* Incoming Message */}
                    <Box sx={{ display: "flex", gap: 1.5 }}>
                      <Avatar
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                        sx={{ width: 36, height: 36 }}
                      />
                      <Box sx={{ maxWidth: "75%" }}>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "rgba(255,255,255,0.5)",
                            fontWeight: 600,
                            ml: 0.5,
                          }}
                        >
                          Emily Watson • 10:42 AM
                        </Typography>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 1.8,
                            borderRadius: "4px 16px 16px 16px",
                            backgroundColor: "rgba(255, 255, 255, 0.06)",
                            border: "1px solid rgba(255, 255, 255, 0.08)",
                            mt: 0.5,
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              color: "rgba(255, 255, 255, 0.9)",
                              lineHeight: 1.5,
                            }}
                          >
                            The new UI designs are ready for review! Check out
                            the live prototype. 🚀
                          </Typography>
                        </Paper>
                      </Box>
                    </Box>

                    {/* Outgoing Message */}
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1.5,
                        alignSelf: "flex-end",
                        maxWidth: "75%",
                      }}
                    >
                      <Box sx={{ textAlign: "right" }}>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "rgba(255,255,255,0.5)",
                            fontWeight: 600,
                            mr: 0.5,
                          }}
                        >
                          You • 10:44 AM
                        </Typography>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 1.8,
                            borderRadius: "16px 16px 4px 16px",
                            background:
                              "linear-gradient(135deg, #7C4DFF 0%, #00E5FF 100%)",
                            mt: 0.5,
                            boxShadow: "0 8px 20px rgba(124, 77, 255, 0.3)",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#FFF",
                              fontWeight: 600,
                              lineHeight: 1.5,
                            }}
                          >
                            Awesome job Emily! Reviewing it right away 🔥
                          </Typography>
                        </Paper>
                      </Box>
                    </Box>
                  </Box>

                  {/* Message Input Area */}
                  <Box
                    sx={{
                      p: 2,
                      borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        backgroundColor: "rgba(255, 255, 255, 0.04)",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        borderRadius: "14px",
                        px: 2,
                        py: 0.8,
                        gap: 1,
                      }}
                    >
                      <IconButton
                        size="small"
                        sx={{ color: "rgba(255,255,255,0.4)" }}
                      >
                        <AttachFileIcon fontSize="small" />
                      </IconButton>
                      <Typography
                        variant="body2"
                        sx={{ color: "rgba(255, 255, 255, 0.3)", flex: 1 }}
                      >
                        Write a message in #{activeChannel}...
                      </Typography>
                      <IconButton
                        size="small"
                        sx={{ color: "rgba(255,255,255,0.4)" }}
                      >
                        <SentimentSatisfiedAltIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        sx={{
                          backgroundColor: "#7C4DFF",
                          color: "#FFF",
                          "&:hover": { backgroundColor: "#6C3CE9" },
                        }}
                      >
                        <SendIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
};
