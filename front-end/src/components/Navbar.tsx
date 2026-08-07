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
  useMediaQuery,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ForumIcon from "@mui/icons-material/Forum";
import PersonIcon from "@mui/icons-material/Person";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import LogoutIcon from "@mui/icons-material/Logout";
import { COLORS } from "../styles";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const navItems = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Preview", href: "#preview" },
  { label: "Testimonials", href: "#testimonials" },
];

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const userInfo = useSelector((state: RootState) => state?.auth?.loginUser);
  const myId = userInfo?.id;
  const isMobile = useMediaQuery("(max-width:900px)");
  const navigate = useNavigate();

  // Check auth state on mount and update dynamically
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsAuthenticated(!!token);

    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setIsAuthenticated(false);
    handleMenuClose();
    if (mobileOpen) setMobileOpen(false);
    navigate("/login");
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled
          ? "1px solid rgba(255, 255, 255, 0.08)"
          : "1px solid transparent",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        py: scrolled ? 0.5 : 1.5,
        zIndex: 1201,
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
                    color: COLORS.textSecondary || "rgba(255,255,255,0.7)",
                    textDecoration: "none",
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    transition: "color 0.2s ease",
                    "&:hover": {
                      color: "#00E5FF",
                    },
                  }}
                >
                  {item.label}
                </Typography>
              ))}
              {isAuthenticated && (
                <Typography
                  component="a"
                  onClick={() => navigate("/chat")}
                  sx={{
                    color: COLORS.textSecondary || "rgba(255,255,255,0.7)",
                    textDecoration: "none",
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    transition: "color 0.2s ease",
                    "&:hover": {
                      color: "#00E5FF",
                    },
                  }}
                >
                  Dashboard
                </Typography>
              )}
            </Box>
          )}

          {/* Action Area: Unauthenticated Buttons OR Authenticated User Avatar */}
          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {isAuthenticated ? (
                <>
                  <IconButton
                    onClick={handleMenuOpen}
                    sx={{
                      p: 0.5,
                      border: "2px solid rgba(124, 77, 255, 0.5)",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        borderColor: "#00E5FF",
                        transform: "scale(1.05)",
                      },
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 36,
                        height: 36,
                        background:
                          "linear-gradient(135deg, #7C4DFF 0%, #00E5FF 100%)",
                        color: "#FFF",
                        fontWeight: 700,
                        fontSize: "0.95rem",
                      }}
                    >
                      U
                    </Avatar>
                  </IconButton>

                  {/* Profile Dropdown Menu */}
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    onClick={handleMenuClose}
                    slotProps={{
                      paper: {
                        sx: {
                          mt: 1.5,
                          width: 200,
                          backgroundColor: "rgba(15, 23, 42, 0.95)",
                          backdropFilter: "blur(20px)",
                          border: "1px solid rgba(255, 255, 255, 0.12)",
                          borderRadius: "16px",
                          boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                          color: "#FFF",
                          overflow: "visible",
                          "&:before": {
                            content: '""',
                            display: "block",
                            position: "absolute",
                            top: 0,
                            right: 18,
                            width: 10,
                            height: 10,
                            bgcolor: "rgba(15, 23, 42, 0.95)",
                            transform: "translateY(-50%) rotate(45deg)",
                            zIndex: 0,
                            borderTop: "1px solid rgba(255, 255, 255, 0.12)",
                            borderLeft: "1px solid rgba(255, 255, 255, 0.12)",
                          },
                        },
                      },
                    }}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                  >
                    <Box sx={{ px: 2, py: 1.5 }}>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 700, color: "#FFF" }}
                      >
                        Logged In
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "rgba(255, 255, 255, 0.5)" }}
                      >
                        User Account
                      </Typography>
                    </Box>
                    <Divider
                      sx={{ borderColor: "rgba(255, 255, 255, 0.08)", my: 0.5 }}
                    />
                    <MenuItem
                      onClick={() => navigate(`/profile/id=${myId}`)}
                      sx={{
                        py: 1,
                        px: 2,
                        borderRadius: "8px",
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 0.05)",
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{ color: "rgba(255, 255, 255, 0.7)", minWidth: 32 }}
                      >
                        <PersonIcon fontSize="small" />
                      </ListItemIcon>
                      Profile
                    </MenuItem>
                    <MenuItem
                      onClick={() => navigate("/chat")}
                      sx={{
                        py: 1,
                        px: 2,
                        borderRadius: "8px",
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 0.05)",
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{ color: "rgba(255, 255, 255, 0.7)", minWidth: 32 }}
                      >
                        <ChatBubbleIcon fontSize="small" />
                      </ListItemIcon>
                      Dashboard
                    </MenuItem>
                    <Divider
                      sx={{ borderColor: "rgba(255, 255, 255, 0.08)", my: 0.5 }}
                    />
                    <MenuItem
                      onClick={handleLogout}
                      sx={{
                        py: 1,
                        px: 2,
                        borderRadius: "8px",
                        color: "#FF5252",
                        "&:hover": {
                          backgroundColor: "rgba(255, 82, 82, 0.1)",
                        },
                      }}
                    >
                      <ListItemIcon sx={{ color: "#FF5252", minWidth: 32 }}>
                        <LogoutIcon fontSize="small" />
                      </ListItemIcon>
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => navigate("/login")}
                    variant="outlined"
                    sx={{
                      borderRadius: "12px",
                      borderColor: "rgba(255, 255, 255, 0.2)",
                      color: "#FFFFFF",
                      textTransform: "none",
                      fontWeight: 600,
                      "&:hover": {
                        borderColor: COLORS.primary || "#7C4DFF",
                        backgroundColor: "rgba(124, 77, 255, 0.08)",
                      },
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => navigate("/SignUp")}
                    variant="contained"
                    sx={{
                      borderRadius: "12px",
                      background:
                        "linear-gradient(135deg, #7C4DFF 0%, #00E5FF 100%)",
                      color: "#FFFFFF",
                      fontWeight: 700,
                      textTransform: "none",
                      boxShadow: "0 4px 15px rgba(124, 77, 255, 0.35)",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 6px 20px rgba(0, 229, 255, 0.45)",
                      },
                    }}
                  >
                    Get Started
                  </Button>
                </>
              )}
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
        slotProps={{
          paper: {
            sx: {
              width: "280px",
              backgroundColor: "rgba(15, 23, 42, 0.95)",
              backdropFilter: "blur(20px)",
              borderLeft: "1px solid rgba(255, 255, 255, 0.08)",
              pt: 8,
              px: 3,
            },
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
              sx={{ py: 1.5, px: 0, color: "#FFF" }}
            >
              <ListItemText
                primary={item.label}
                slotProps={{
                  primary: { sx: { fontWeight: 600, fontSize: "1.1rem" } },
                }}
              />
            </ListItem>
          ))}
          {isAuthenticated && (
            <ListItem
              component="a"
              onClick={() => navigate("/chat")}
              sx={{ py: 1.5, px: 0, color: "#FFF" }}
            >
              <ListItemText
                primary={"Dashboard"}
                slotProps={{
                  primary: { sx: { fontWeight: 600, fontSize: "1.1rem" } },
                }}
              />
            </ListItem>
          )}
        </List>

        <Box sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 2 }}>
          {isAuthenticated ? (
            <Button
              onClick={handleLogout}
              fullWidth
              variant="outlined"
              color="error"
              startIcon={<LogoutIcon />}
              sx={{
                py: 1.2,
                borderRadius: "12px",
                borderColor: "rgba(255, 82, 82, 0.4)",
                color: "#FF5252",
                fontWeight: 600,
              }}
            >
              Logout
            </Button>
          ) : (
            <>
              <Button
                onClick={() => {
                  handleDrawerToggle();
                  navigate("/login");
                }}
                fullWidth
                variant="outlined"
                sx={{
                  py: 1.2,
                  borderRadius: "12px",
                  color: "#FFF",
                  borderColor: "rgba(255,255,255,0.2)",
                }}
              >
                Login
              </Button>
              <Button
                onClick={() => {
                  handleDrawerToggle();
                  navigate("/SignUp");
                }}
                fullWidth
                variant="contained"
                sx={{
                  py: 1.2,
                  borderRadius: "12px",
                  background:
                    "linear-gradient(135deg, #7C4DFF 0%, #00E5FF 100%)",
                  fontWeight: 700,
                }}
              >
                Get Started
              </Button>
            </>
          )}
        </Box>
      </Drawer>
    </AppBar>
  );
};
