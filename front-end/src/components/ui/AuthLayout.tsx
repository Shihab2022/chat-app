/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode } from "react";
import { Box, Container, Stack, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import Logo from "./Logo";
import ChatBubbleRoundedIcon from "@mui/icons-material/ChatBubbleRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";

interface AuthLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  maxWidth?: "xs" | "sm";
}

const BRAND_POINTS = [
  { icon: <ChatBubbleRoundedIcon sx={{ fontSize: 18 }} />, text: "Real-time messaging that feels instant" },
  { icon: <GroupRoundedIcon sx={{ fontSize: 18 }} />, text: "Group chats with rich collaboration tools" },
  { icon: <BoltRoundedIcon sx={{ fontSize: 18 }} />, text: "Fast, secure and always in sync" },
];

const AuthLayout = ({ children, title, subtitle, maxWidth = "sm" }: AuthLayoutProps) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        display: "flex",
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Box
        sx={{
          flex: 1.1,
          display: { xs: "none", lg: "flex" },
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          overflow: "hidden",
          px: { xl: 10, lg: 6 },
          py: 6,
          borderRight: `1px solid ${theme.palette.divider}`,
          backgroundColor: "#EAF2FB",
        }}
      >
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            width: 520,
            height: 520,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.14)} 0%, transparent 65%)`,
            filter: "blur(60px)",
            top: "-10%",
            left: "-8%",
          }}
        />
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            width: 460,
            height: 460,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.12)} 0%, transparent 65%)`,
            filter: "blur(70px)",
            bottom: "-5%",
            right: "-6%",
          }}
        />

        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Logo onClick={() => (window.location.href = "/")} size={36} />
        </Box>

        <Box sx={{ position: "relative", zIndex: 1, maxWidth: 460 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              fontSize: { lg: "2.4rem", xl: "2.9rem" },
              lineHeight: 1.15,
              letterSpacing: "-0.03em",
              mb: 2,
              color: theme.palette.text.primary,
            }}
          >
            Conversations that{" "}
            <Box component="span" sx={{ color: theme.palette.primary.main }}>
              move at the speed of you.
            </Box>
          </Typography>
          <Typography variant="body1" sx={{ color: theme.palette.text.secondary, mb: 4, fontSize: "1.05rem", lineHeight: 1.7, maxWidth: 400 }}>
            Chatty brings your friends and teams together with effortless real-time messaging — wherever you are.
          </Typography>

          <Stack spacing={1.75}>
            {BRAND_POINTS.map((point) => (
              <Stack key={point.text} direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                <Box
                  sx={{
                    width: 34,
                    height: 34,
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  }}
                >
                  {point.icon}
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 500, color: theme.palette.text.primary }}>
                  {point.text}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Box>

        <Typography variant="caption" sx={{ color: theme.palette.text.disabled, position: "relative", zIndex: 1 }}>
          © {new Date().getFullYear()} Chatty. Built for connection.
        </Typography>
      </Box>

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          px: { xs: 2.5, sm: 4, lg: 6 },
          py: { xs: 4, lg: 6 },
          position: "relative",
        }}
      >
        <Box sx={{ position: "absolute", top: 20, left: 20, display: { lg: "none" } }}>
          <Logo onClick={() => (window.location.href = "/")} size={30} showText={false} />
        </Box>

        <Container maxWidth={maxWidth} sx={{ width: "100%" }}>
          {title && (
            <>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 800, letterSpacing: "-0.02em", mb: 0.75 }}>
                {title}
              </Typography>
              {subtitle && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3.5, lineHeight: 1.6 }}>
                  {subtitle}
                </Typography>
              )}
            </>
          )}
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default AuthLayout;