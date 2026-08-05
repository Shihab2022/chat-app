import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ForumIcon from "@mui/icons-material/Forum";

const navItems = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Preview", href: "#preview" },
  { label: "Testimonials", href: "#testimonials" },
];

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: scrolled ? "rgba(15, 23, 42, 0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled
          ? "1px solid rgba(255, 255, 255, 0.08)"
          : "1px solid transparent",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        py: scrolled ? 0.5 : 1.5,
        zIndex: theme.zIndex.drawer + 1,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
          {/* Logo */}
          <Box
            component="a"
            href="#"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "12px",
                background: "linear-gradient(135deg, #7C4DFF 0%, #00E5FF 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 20px rgba(124, 77, 255, 0.4)",
              }}
            >
              <ForumIcon sx={{ color: "#FFFFFF", fontSize: 24 }} />
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                fontSize: "1.4rem",
                letterSpacing: "-0.5px",
                background: "linear-gradient(135deg, #FFFFFF 0%, #E2E8F0 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Chatty
            </Typography>
          </Box>

          {/* Desktop Nav Items */}
          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
              {navItems.map((item) => (
                <Typography
                  key={item.label}
                  component="a"
                  href={item.href}
                  sx={{
                    color: "text.secondary",
                    textDecoration: "none",
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    transition: "color 0.2s ease",
                    "&:hover": {
                      color: "primary.light",
                    },
                  }}
                >
                  {item.label}
                </Typography>
              ))}
            </Box>
          )}

          {/* Action Buttons */}
          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Button
                variant="outlined"
                sx={{
                  borderColor: "rgba(255, 255, 255, 0.2)",
                  color: "#FFFFFF",
                  "&:hover": {
                    borderColor: "primary.main",
                    backgroundColor: "rgba(124, 77, 255, 0.08)",
                  },
                }}
              >
                Login
              </Button>
              <Button
                variant="contained"
                sx={{
                  background:
                    "linear-gradient(135deg, #7C4DFF 0%, #00E5FF 100%)",
                  color: "#FFFFFF",
                  fontWeight: 700,
                  boxShadow: "0 4px 15px rgba(124, 77, 255, 0.35)",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 20px rgba(0, 229, 255, 0.45)",
                  },
                }}
              >
                Get Started
              </Button>
            </Box>
          )}

          {/* Mobile Menu Icon */}
          {isMobile && (
            <IconButton
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ color: "#FFFFFF" }}
            >
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          )}
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        PaperProps={{
          sx: {
            width: "280px",
            backgroundColor: "rgba(15, 23, 42, 0.95)",
            backdropFilter: "blur(20px)",
            borderLeft: "1px solid rgba(255, 255, 255, 0.08)",
            pt: 8,
            px: 3,
          },
        }}
      >
        <List sx={{ width: "100%" }}>
          {navItems.map((item) => (
            <ListItem
              key={item.label}
              component="a"
              href={item.href}
              onClick={handleDrawerToggle}
              sx={{ py: 1.5, px: 0, color: "text.primary" }}
            >
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ fontWeight: 600, fontSize: "1.1rem" }}
              />
            </ListItem>
          ))}
        </List>
        <Box sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 2 }}>
          <Button fullWidth variant="outlined" sx={{ py: 1.2 }}>
            Login
          </Button>
          <Button
            fullWidth
            variant="contained"
            sx={{
              py: 1.2,
              background: "linear-gradient(135deg, #7C4DFF 0%, #00E5FF 100%)",
              fontWeight: 700,
            }}
          >
            Get Started
          </Button>
        </Box>
      </Drawer>
    </AppBar>
  );
};
