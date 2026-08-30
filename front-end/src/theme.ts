/* eslint-disable @typescript-eslint/no-explicit-any */
import { createTheme, alpha } from "@mui/material/styles";

/**
 * Chatty — Modern Light Design System
 * Crisp, airy, WhatsApp Web + macOS Messages inspired. Primary = Clean Chatty Blue.
 */
export const CHATTY_PRIMARY = "#0066CC";
export const CHATTY_PRIMARY_LIGHT = "#4D94E0";
export const CHATTY_PRIMARY_DARK = "#0050A3";
export const CHATTY_SUCCESS = "#00A884";
export const CHATTY_WARNING = "#B26A00";
export const CHATTY_ERROR = "#D93025";
export const CHATTY_ONLINE = "#00A884";

// Light surfaces
export const SURFACE_0 = "#F0F2F5";
export const SURFACE_1 = "#FFFFFF";
export const SURFACE_2 = "#FAFBFC";
export const SURFACE_3 = "#F4F6F8";

export const BORDER_SUBTLE = "#E4E6EB";
export const BORDER_DEFAULT = "#E9EDEF";

export const TEXT_PRIMARY = "#111B21";
export const TEXT_SECONDARY = "#667781";
export const TEXT_MUTED = "#8696A0";

// Chat-specific tokens (light mode)
export const CHATTY_CHAT_WALLPAPER = "#EFEAE2";
export const CHATTY_OUTGOING_BUBBLE = "#D9ECFF"; // soft light blue
export const CHATTY_INCOMING_BUBBLE = "#FFFFFF";
export const CHATTY_ACTIVE_CONVERSATION = "#E7F0FD";

export const FONT_FAMILY =
  "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

export const DIALOG_SHADOW =
  "0 4px 16px rgba(15,23,42,0.10), 0 24px 64px rgba(15,23,42,0.18)";
export const POPOVER_SHADOW =
  "0 2px 8px rgba(15,23,42,0.06), 0 12px 28px rgba(15,23,42,0.12)";
export const CARD_SHADOW =
  "0 1px 2px rgba(15,23,42,0.05), 0 4px 16px rgba(15,23,42,0.08)";

export const chattyTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: CHATTY_PRIMARY,
      light: CHATTY_PRIMARY_LIGHT,
      dark: CHATTY_PRIMARY_DARK,
      contrastText: "#FFFFFF",
    },
    secondary: { main: "#0E8F6E", light: "#39B08E", dark: "#0B6E55", contrastText: "#FFFFFF" },
    success: { main: CHATTY_SUCCESS, light: "#2DC995", dark: "#0E8A67", contrastText: "#FFFFFF" },
    warning: { main: CHATTY_WARNING, light: "#D68A2D", dark: "#8A5200", contrastText: "#FFFFFF" },
    error: { main: CHATTY_ERROR, light: "#EC5B5B", dark: "#A91C16", contrastText: "#FFFFFF" },
    info: { main: "#0EA5E9", light: "#5BC0EE", dark: "#0276AA", contrastText: "#FFFFFF" },
    background: { default: SURFACE_0, paper: SURFACE_1 },
    text: { primary: TEXT_PRIMARY, secondary: TEXT_SECONDARY, disabled: TEXT_MUTED },
    divider: BORDER_DEFAULT,
    action: {
      active: "#54656F",
      hover: "rgba(15,23,42,0.05)",
      selected: "rgba(0,102,204,0.10)",
      selectedOpacity: 0.1,
      disabled: "rgba(15,23,42,0.3)",
      disabledBackground: "rgba(15,23,42,0.05)",
      focus: "rgba(0,102,204,0.18)",
    },
    common: { black: "#000000", white: "#FFFFFF" },
    grey: {
      50: "#F8F9FA",
      100: "#F0F2F5",
      200: "#E4E6EB",
      300: "#D0D5DD",
      400: "#B4BCC3",
      500: "#8A949E",
      600: "#667781",
      700: "#54656F",
      800: "#3D4A53",
      900: "#1F2A33",
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
        "*": { scrollbarWidth: "thin", scrollbarColor: `#C9D2DA transparent` },
        "::-webkit-scrollbar": { width: 8, height: 8 },
        "::-webkit-scrollbar-track": { background: "transparent" },
        "::-webkit-scrollbar-thumb": { backgroundColor: "#C9D2DA", borderRadius: 8 },
        "::-webkit-scrollbar-thumb:hover": { backgroundColor: "#AEB8C1" },
        ":focus-visible": { outline: "2px solid rgba(0,102,204,0.6)", outlineOffset: "2px" },
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
            boxShadow: `0 1px 2px rgba(15,23,42,0.12), 0 4px 12px ${alpha(CHATTY_PRIMARY, 0.22)}`,
            "&:hover": { boxShadow: `0 1px 2px rgba(15,23,42,0.12), 0 6px 18px ${alpha(CHATTY_PRIMARY, 0.32)}` },
          },
        },
        sizeSmall: { padding: "6px 12px", fontSize: "0.8125rem" },
        sizeMedium: { padding: "9px 18px", fontSize: "0.875rem" },
        sizeLarge: { padding: "12px 22px", fontSize: "0.9375rem", borderRadius: 12 },
        outlined: {
          borderColor: "#D0D5DD",
          "&:hover": { borderColor: "#B4BCC3", backgroundColor: "rgba(15,23,42,0.03)" },
        },
        text: { "&:hover": { backgroundColor: "rgba(15,23,42,0.05)" } },
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
          "&:hover:not(.Mui-disabled) fieldset": { borderColor: "#D0D5DD" },
          "&.Mui-focused fieldset": { borderColor: `${CHATTY_PRIMARY} !important` },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: { root: { "&.Mui-focused": { color: CHATTY_PRIMARY } } },
    },
    MuiTextField: { defaultProps: { variant: "outlined", size: "small" } },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 8, fontWeight: 600 },
        colorPrimary: { backgroundColor: alpha(CHATTY_PRIMARY, 0.12), color: CHATTY_PRIMARY },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 18, backgroundColor: SURFACE_1, backgroundImage: "none", boxShadow: DIALOG_SHADOW },
      },
    },
    MuiDialogTitle: { styleOverrides: { root: { fontWeight: 700, fontSize: "1.05rem", color: TEXT_PRIMARY } } },
    MuiDialogContentText: { styleOverrides: { root: { color: TEXT_SECONDARY } } },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 14,
          backgroundColor: SURFACE_1,
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
          "&:hover": { backgroundColor: "rgba(15,23,42,0.05)" },
          "&.Mui-selected": { backgroundColor: alpha(CHATTY_PRIMARY, 0.1) },
        },
      },
    },
    MuiDivider: { styleOverrides: { root: { borderColor: BORDER_DEFAULT } } },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "#1F2A33",
          color: "#F8F9FA",
          borderRadius: 8,
          border: `1px solid rgba(255,255,255,0.08)`,
          boxShadow: POPOVER_SHADOW,
          fontSize: "0.75rem",
          padding: "6px 10px",
        },
        arrow: { color: "#1F2A33" },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: alpha(CHATTY_PRIMARY, 0.14),
          color: CHATTY_PRIMARY,
          fontWeight: 600,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: { root: { borderRadius: 10, transition: "background-color 160ms ease" } },
    },
    MuiBackdrop: {
      styleOverrides: { root: { backgroundColor: "rgba(17, 27, 33, 0.35)", backdropFilter: "blur(2px)" } },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 8,
          "&.Mui-selected": { color: CHATTY_PRIMARY },
        },
      },
    },
    MuiSkeleton: { styleOverrides: { root: { backgroundColor: "rgba(15,23,42,0.08)" } } },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          "&.MuiAlert-standardError": { backgroundColor: alpha(CHATTY_ERROR, 0.1), color: "#A91C16" },
          "&.MuiAlert-standardSuccess": { backgroundColor: alpha(CHATTY_SUCCESS, 0.1), color: "#0E8A67" },
          "&.MuiAlert-standardWarning": { backgroundColor: alpha(CHATTY_WARNING, 0.1), color: "#8A5200" },
          "&.MuiAlert-standardInfo": { backgroundColor: alpha("#0EA5E9", 0.1), color: "#0276AA" },
        },
      },
    },
    MuiTableHead: { styleOverrides: { root: { "& .MuiTableCell-root": { fontWeight: 700 } } } },
    MuiTableCell: { styleOverrides: { root: { borderColor: BORDER_SUBTLE, color: TEXT_PRIMARY } } },
    MuiLinearProgress: {
      styleOverrides: { root: { borderRadius: 6, height: 6, backgroundColor: "rgba(15,23,42,0.08)" } },
    },
    MuiBadge: { styleOverrides: { badge: { fontWeight: 700 } } },
    //COMPONENTS_OVERRIDES_END
  },
});