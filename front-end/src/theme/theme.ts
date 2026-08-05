import { createTheme, ThemeOptions } from "@mui/material/styles";

export const glassStyle = {
  background: "rgba(30, 41, 59, 0.55)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
  borderRadius: "20px",
};

const themeOptions: ThemeOptions = {
  palette: {
    mode: "dark",
    primary: {
      main: "#7C4DFF",
      light: "#B388FF",
      dark: "#651FFF",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#00E5FF",
      light: "#18FFFF",
      dark: "#00B8D4",
      contrastText: "#000000",
    },
    background: {
      default: "#0F172A",
      paper: "#1E293B",
    },
    text: {
      primary: "#F8FAFC",
      secondary: "#94A3B8",
    },
  },
  typography: {
    fontFamily:
      '"Plus Jakarta Sans", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      letterSpacing: "-0.02em",
    },
    h2: {
      fontWeight: 700,
      letterSpacing: "-0.01em",
    },
    h3: {
      fontWeight: 700,
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 20,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          padding: "10px 24px",
          fontSize: "0.95rem",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
  },
};

export const theme = createTheme(themeOptions);
