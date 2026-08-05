import React from "react";
import { Box, Container, Paper, Typography, Avatar } from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import SearchIcon from "@mui/icons-material/Search";
import SendIcon from "@mui/icons-material/Send";
import PhoneIcon from "@mui/icons-material/Phone";
import VideocamIcon from "@mui/icons-material/Videocam";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { SectionTitle } from "./SectionTitle";
import { glassStyle } from "../theme/theme";

export const Preview: React.FC = () => {
  return (
    <Box
      id="preview"
      sx={{ py: { xs: 8, md: 12 }, position: "relative", zIndex: 1 }}
    >
      <Container maxWidth="lg">
        <SectionTitle
          badge="INTERFACE PREVIEW"
          title="Beautiful Across Every Device"
          subtitle="Immerse yourself in a ultra-clean layout carefully crafted for clarity and effortless navigation."
        />

        {/* Desktop Container */}
        <Paper
          elevation={0}
          sx={{
            ...glassStyle,
            p: { xs: 1, sm: 2 },
            maxWidth: "1000px",
            mx: "auto",
            overflow: "hidden",
            boxShadow: "0 25px 60px rgba(0, 0, 0, 0.6)",
          }}
        >
          {/* Window Mac Controls */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 2,
              py: 1.5,
            }}
          >
            <CircleIcon sx={{ fontSize: 12, color: "#FF5F56" }} />
            <CircleIcon sx={{ fontSize: 12, color: "#FFBD2E" }} />
            <CircleIcon sx={{ fontSize: 12, color: "#27C93F" }} />
            <Typography
              variant="caption"
              sx={{ color: "text.secondary", ml: 2, fontWeight: 500 }}
            >
              Chatty Desktop App
            </Typography>
          </Box>

          {/* Desktop App UI Content */}
          <Box
            sx={{
              display: "flex",
              height: { xs: "380px", sm: "480px" },
              borderRadius: "12px",
              backgroundColor: "rgba(15, 23, 42, 0.8)",
              overflow: "hidden",
              border: "1px solid rgba(255, 255, 255, 0.05)",
            }}
          >
            {/* Sidebar */}
            <Box
              sx={{
                width: { xs: "80px", sm: "260px" },
                borderRight: "1px solid rgba(255, 255, 255, 0.08)",
                p: 2,
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  display: { xs: "none", sm: "flex" },
                  alignItems: "center",
                  gap: 1,
                  px: 1.5,
                  py: 1,
                  borderRadius: "10px",
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  color: "text.secondary",
                }}
              >
                <SearchIcon fontSize="small" />
                <Typography variant="body2">Search channels...</Typography>
              </Box>

              {[
                { name: "General Team", active: true, badge: "3" },
                { name: "Design Sprint", active: false },
                { name: "Product Announcements", active: false },
              ].map((chat, i) => (
                <Box
                  key={i}
                  sx={{
                    p: 1.5,
                    borderRadius: "10px",
                    backgroundColor: chat.active
                      ? "rgba(124, 77, 255, 0.2)"
                      : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: chat.active ? 700 : 500,
                      color: chat.active ? "#FFF" : "text.secondary",
                      display: { xs: "none", sm: "block" },
                    }}
                  >
                    # {chat.name}
                  </Typography>
                  {chat.badge && (
                    <Box
                      sx={{
                        px: 1,
                        py: 0.2,
                        borderRadius: "10px",
                        backgroundColor: "secondary.main",
                        color: "#000",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        display: { xs: "none", sm: "block" },
                      }}
                    >
                      {chat.badge}
                    </Box>
                  )}
                </Box>
              ))}
            </Box>

            {/* Chat Main Area */}
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
              {/* Header */}
              <Box
                sx={{
                  px: 3,
                  py: 1.5,
                  borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 700, color: "#FFF" }}
                >
                  # General Team
                </Typography>
                <Box sx={{ display: "flex", gap: 1, color: "text.secondary" }}>
                  <PhoneIcon fontSize="small" />
                  <VideocamIcon fontSize="small" />
                  <MoreVertIcon fontSize="small" />
                </Box>
              </Box>

              {/* Message Feed */}
              <Box
                sx={{
                  flex: 1,
                  p: 3,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  overflowY: "auto",
                }}
              >
                <Box sx={{ display: "flex", gap: 1.5 }}>
                  <Avatar src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" />
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{ color: "#FFF", fontWeight: 600 }}
                    >
                      Emily Watson
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                        p: 1.5,
                        borderRadius: "0px 12px 12px 12px",
                        mt: 0.5,
                      }}
                    >
                      The new UI designs are ready for review! Check out the
                      prototype.
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", gap: 1.5, alignSelf: "flex-end" }}>
                  <Box sx={{ textAlign: "right" }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#FFF",
                        backgroundColor: "primary.main",
                        p: 1.5,
                        borderRadius: "12px 12px 0px 12px",
                      }}
                    >
                      Awesome job Emily! Reviewing it right away 🔥
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Bottom Input */}
              <Box
                sx={{ p: 2, borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    borderRadius: "12px",
                    px: 2,
                    py: 1,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", flex: 1 }}
                  >
                    Write a message in # General Team...
                  </Typography>
                  <SendIcon sx={{ color: "primary.light", fontSize: 20 }} />
                </Box>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};
