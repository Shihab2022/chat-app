/* eslint-disable @typescript-eslint/no-explicit-any */
import { createTheme, alpha } from "@mui/material/styles";

/**
 * Chatty — Modern Design System
 * Dark, premium, Linear/Slack-inspired. Primary = Chatty indigo.
 */
export const CHATTY_PRIMARY = "#4F46E5";
export const CHATTY_PRIMARY_LIGHT = "#818CF8";
export const CHATTY_PRIMARY_DARK = "#4338CA";
export const CHATTY_SUCCESS = "#2DD4A7";
export const CHATTY_WARNING = "#F5A524";
export const CHATTY_ERROR = "#F43F5E";
export const CHATTY_ONLINE = "#2DD4A7";

export const SURFACE_0 = "#0C0E13";
export const SURFACE_1 = "#12151B";
export const SURFACE_2 = "#191D25";
export const SURFACE_3 = "#222732";

export const BORDER_SUBTLE = "rgba(255, 255, 255, 0.06)";
export const BORDER_DEFAULT = "rgba(255, 255, 255, 0.10)";

export const TEXT_PRIMARY = "#EDEEF2";
export const TEXT_SECONDARY = "#9AA2AF";
export const TEXT_MUTED = "#5D646F";

export const FONT_FAMILY =
  "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

export const DIALOG_SHADOW =
  "0 0 0 1px rgba(255,255,255,0.04), 0 8px 20px rgba(0,0,0,0.4), 0 24px 60px rgba(0,0,0,0.55)";
export const POPOVER_SHADOW =
  "0 0 0 1px rgba(255,255,255,0.05), 0 4px 12px rgba(0,0,0,0.35), 0 12px 32px rgba(0,0,0,0.5)";
export const CARD_SHADOW =
  "0 0 0 1px rgba(255,255,255,0.04), 0 1px 2px rgba(0,0,0,0.3), 0 6px 18px rgba(0,0,0,0.28)";

export const chattyTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: CHATTY_PRIMARY,
      light: CHATTY_PRIMARY_LIGHT,
      dark: CHATTY_PRIMARY_DARK,
      contrastText: "#FFFFFF",
    },
    secondary: { main: "#38BDF8", light: "#7DD3FC", dark: "#0EA5E9", contrastText: "#08101A" },
    success: { main: CHATTY_SUCCESS, contrastText: "#06130E" },
    warning: { main: CHATTY_WARNING, contrastText: "#1A1204" },
    error: { main: CHATTY_ERROR, light: "#FB7185", dark: "#E11D48", contrastText: "#FFFFFF" },
    info: { main: "#38BDF8", contrastText: "#08101A" },
    background: { default: SURFACE_0, paper: SURFACE_1 },
    text: { primary: TEXT_PRIMARY, secondary: TEXT_SECONDARY, disabled: TEXT_MUTED },
    divider: BORDER_DEFAULT,
    action: {
      active: "#C3C8D2",
      hover: "rgba(255,255,255,0.055)",
      selected: "rgba(79,70,229,0.16)",
      disabled: "rgba(255,255,255,0.2)",
      disabledBackground: "rgba(255,255,255,0.06)",
      focus: "rgba(79,70,229,0.28)",
    },
    common: { black: "#000000", white: "#FFFFFF" },
    grey: {
      50: "#F6F7F9",
      100: "#EEF0F3",
      200: "#DDE0E6",
      300: "#C3C8D2",
      400: "#9AA2AF",
      500: "#757D89",
      600: "#5D646F",
      700: "#3C424C",
      800: "#222732",
      900: "#191D25",
    },
  },
  shape: { borderRadius: 12 },
  spacing: 8,
  typography: {
    fontFamily: FONT_FAMILY,
    h1: { fontWeight: 800, letterSpacing: "-0.035em" },
    h2: { fontWeight: 800, letterSpacing: "-0.03em" },
    h3: { fontWeight: 700, letterSpacing: "-0.02em" },
    h4: { fontWeight: 700, letterSpacing: "-0.015em" },
    h5: { fontWeight: 700, letterSpacing: "-0.01em" },
    h6: { fontWeight: 600, letterSpacing: "-0.005em" },
    subtitle1: { fontWeight: 600 },
    subtitle2: { fontWeight: 600 },
    button: { fontWeight: 600, textTransform: "none", letterSpacing: "0" },
    caption: { fontWeight: 500 },
    body1: { letterSpacing: "0" },
    body2: { letterSpacing: "0" },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: SURFACE_0,
          fontFamily: FONT_FAMILY,
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
          color: TEXT_PRIMARY,
        },
        "*": { scrollbarWidth: "thin", scrollbarColor: `${SURFACE_3} transparent` },
        "::-webkit-scrollbar": { width: 8, height: 8 },
        "::-webkit-scrollbar-track": { background: "transparent" },
        "::-webkit-scrollbar-thumb": { backgroundColor: SURFACE_3, borderRadius: 8 },
        "::-webkit-scrollbar-thumb:hover": { backgroundColor: "#2C3340" },
        ":focus-visible": { outline: "2px solid rgba(129,140,248,0.7)", outlineOffset: "2px" },
      },
    },
    MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 10,
          textTransform: "none",
          fontWeight: 600,
          transition:
            "background-color 160ms ease, box-shadow 160ms ease, transform 120ms ease, opacity 160ms ease",
          "&:active": { transform: "translateY(0.5px)" },
          "&.MuiButton-containedPrimary": {
            boxShadow: `0 1px 2px rgba(0,0,0,0.25), 0 6px 16px ${alpha(CHATTY_PRIMARY, 0.28)}`,
            "&:hover": { boxShadow: `0 1px 2px rgba(0,0,0,0.25), 0 8px 22px ${alpha(CHATTY_PRIMARY, 0.38)}` },
          },
        },
        sizeSmall: { padding: "6px 12px", fontSize: "0.8125rem" },
        sizeMedium: { padding: "9px 18px", fontSize: "0.875rem" },
        sizeLarge: { padding: "12px 22px", fontSize: "0.9375rem", borderRadius: 12 },
        outlined: {
          borderColor: BORDER_DEFAULT,
          "&:hover": { borderColor: "rgba(255,255,255,0.18)", backgroundColor: "rgba(255,255,255,0.04)" },
        },
        text: { "&:hover": { backgroundColor: "rgba(255,255,255,0.05)" } },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          transition: "background-color 160ms ease, color 160ms ease, transform 120ms ease",
          "&:active": { transform: "scale(0.96)" },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: "rgba(255,255,255,0.025)",
          transition: "border-color 160ms ease, background-color 160ms ease, box-shadow 160ms ease",
          "& .MuiOutlinedInput-notchedOutline": { borderColor: BORDER_DEFAULT },
          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.18)" },
          "&.Mui-focused": {
            backgroundColor: "rgba(255,255,255,0.04)",
            boxShadow: `0 0 0 3px ${alpha(CHATTY_PRIMARY, 0.25)}`,
            "& .MuiOutlinedInput-notchedOutline": { borderColor: CHATTY_PRIMARY },
          },
        },
        input: { "&::placeholder": { color: TEXT_MUTED, opacity: 1 } },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          "& fieldset": { borderColor: BORDER_DEFAULT },
          "&:hover:not(.Mui-disabled) fieldset": { borderColor: "rgba(255,255,255,0.18)" },
          "&.Mui-focused fieldset": { borderColor: `${CHATTY_PRIMARY} !important` },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: { root: { "&.Mui-focused": { color: CHATTY_PRIMARY_LIGHT } } },
    },
    MuiTextField: { defaultProps: { variant: "outlined", size: "small" } },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 8, fontWeight: 600 },
        colorPrimary: { backgroundColor: alpha(CHATTY_PRIMARY, 0.16), color: CHATTY_PRIMARY_LIGHT },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 18, backgroundColor: SURFACE_2, backgroundImage: "none", boxShadow: DIALOG_SHADOW },
      },
    },
    MuiDialogTitle: { styleOverrides: { root: { fontWeight: 700, fontSize: "1.05rem", color: TEXT_PRIMARY } } },
    MuiDialogContentText: { styleOverrides: { root: { color: TEXT_SECONDARY } } },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 14,
          backgroundColor: SURFACE_3,
          backgroundImage: "none",
          boxShadow: POPOVER_SHADOW,
          border: `1px solid ${BORDER_SUBTLE}`,
          paddingTop: 6,
          paddingBottom: 6,
        },
        list: { padding: 0 },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: "2px 6px",
          padding: "9px 12px",
          minHeight: "auto",
          fontSize: "0.875rem",
          color: TEXT_PRIMARY,
          transition: "background-color 150ms ease",
          "&:hover": { backgroundColor: "rgba(255,255,255,0.06)" },
          "&.Mui-selected": { backgroundColor: alpha(CHATTY_PRIMARY, 0.16) },
        },
      },
    },
    MuiDivider: { styleOverrides: { root: { borderColor: BORDER_DEFAULT } } },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: SURFACE_3,
          color: TEXT_PRIMARY,
          borderRadius: 8,
          border: `1px solid ${BORDER_SUBTLE}`,
          boxShadow: POPOVER_SHADOW,
          fontSize: "0.75rem",
          padding: "6px 10px",
        },
        arrow: { color: SURFACE_3 },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: alpha(CHATTY_PRIMARY, 0.22),
          color: TEXT_PRIMARY,
          fontWeight: 600,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: { root: { borderRadius: 10, transition: "background-color 160ms ease" } },
    },
    MuiBackdrop: {
      styleOverrides: { root: { backgroundColor: "rgba(3, 4, 7, 0.6)", backdropFilter: "blur(3px)" } },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 8,
          "&.Mui-selected": { color: CHATTY_PRIMARY_LIGHT },
        },
      },
    },
    MuiSkeleton: { styleOverrides: { root: { backgroundColor: "rgba(255,255,255,0.07)" } } },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          "&.MuiAlert-standardError": { backgroundColor: alpha(CHATTY_ERROR, 0.12), color: "#FECDD3" },
          "&.MuiAlert-standardSuccess": { backgroundColor: alpha(CHATTY_SUCCESS, 0.12), color: "#A7F3D0" },
          "&.MuiAlert-standardWarning": { backgroundColor: alpha(CHATTY_WARNING, 0.12), color: "#FDE68A" },
          "&.MuiAlert-standardInfo": { backgroundColor: alpha("#38BDF8", 0.12), color: "#BAE6FD" },
        },
      },
    },
    MuiTableHead: { styleOverrides: { root: { "& .MuiTableCell-root": { fontWeight: 700 } } } },
    MuiTableCell: { styleOverrides: { root: { borderColor: BORDER_SUBTLE, color: TEXT_PRIMARY } } },
    MuiLinearProgress: {
      styleOverrides: { root: { borderRadius: 6, height: 6, backgroundColor: "rgba(255,255,255,0.08)" } },
    },
    MuiBadge: { styleOverrides: { badge: { fontWeight: 700 } } },
    //COMPONENTS_OVERRIDES_END
  },
});