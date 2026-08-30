import { createTheme } from "@mui/material/styles";
import { FontSizeOption, ThemeMode } from "./redux/features/settings/settingsSlice";

export const PURPLE_PRIMARY = "#7C3AED";
export const PURPLE_DARK = "#6D28D9";
export const PURPLE_LIGHT = "#EDE9FE";
export const PURPLE_VERY_LIGHT = "#F5F3FF";
export const PURPLE_BORDER = "#C4B5FD";

export const BG_APP_LIGHT = "#FFFFFF";
export const BG_APP_DARK = "#111827";
export const BG_SIDEBAR_LIGHT = "#F8F9FB";
export const BG_SIDEBAR_DARK = "#1F2937";
export const BG_SURFACE_LIGHT = "#F5F6F8";
export const BG_SURFACE_DARK = "#1E293B";

export const TEXT_PRIMARY_LIGHT = "#111827";
export const TEXT_PRIMARY_DARK = "#F9FAFB";
export const TEXT_SECONDARY_LIGHT = "#6B7280";
export const TEXT_SECONDARY_DARK = "#9CA3AF";
export const TEXT_MUTED = "#9CA3AF";

export const BORDER_DEFAULT_LIGHT = "#E5E7EB";
export const BORDER_DEFAULT_DARK = "#374151";

export const STATUS_ONLINE = "#10B981";
export const STATUS_TYPING = "#7C3AED";
export const BADGE_UNREAD = "#EF4444";

export const MSG_RECEIVED_BG_LIGHT = "#FFFFFF";
export const MSG_RECEIVED_BG_DARK = "#1F2937";
export const MSG_SENT_BG = "#6D3FD5";

// Compatibility export
export const CHATTY_ACTIVE_CONVERSATION = PURPLE_PRIMARY;
export const CHATTY_INCOMING_BUBBLE = MSG_RECEIVED_BG_LIGHT;
export const CHATTY_OUTGOING_BUBBLE = MSG_SENT_BG;

const FONT_SIZE_SCALES: Record<FontSizeOption, { base: number; htmlFontSize: number }> = {
  small: { base: 13, htmlFontSize: 14 },
  default: { base: 14, htmlFontSize: 16 },
  large: { base: 15.5, htmlFontSize: 18 },
  "extra-large": { base: 17, htmlFontSize: 20 },
};

export function createAppTheme(
  mode: ThemeMode = "light",
  fontSize: FontSizeOption = "default",
  compactList: boolean = false
) {
  const isDark = mode === "dark";
  const scale = FONT_SIZE_SCALES[fontSize] || FONT_SIZE_SCALES.default;

  return createTheme({
    palette: {
      mode,
      primary: {
        main: PURPLE_PRIMARY,
        dark: PURPLE_DARK,
        light: PURPLE_LIGHT,
        contrastText: "#FFFFFF",
      },
      secondary: {
        main: "#6366F1",
        light: "#EEF2FF",
        dark: "#4F46E5",
      },
      success: {
        main: STATUS_ONLINE,
        contrastText: "#FFFFFF",
      },
      error: {
        main: BADGE_UNREAD,
        contrastText: "#FFFFFF",
      },
      background: {
        default: isDark ? BG_APP_DARK : BG_APP_LIGHT,
        paper: isDark ? BG_SIDEBAR_DARK : BG_APP_LIGHT,
      },
      text: {
        primary: isDark ? TEXT_PRIMARY_DARK : TEXT_PRIMARY_LIGHT,
        secondary: isDark ? TEXT_SECONDARY_DARK : TEXT_SECONDARY_LIGHT,
      },
      divider: isDark ? BORDER_DEFAULT_DARK : BORDER_DEFAULT_LIGHT,
    },
    typography: {
      fontFamily: [
        "-apple-system",
        "BlinkMacSystemFont",
        '"Segoe UI"',
        "Roboto",
        '"Helvetica Neue"',
        "Arial",
        "sans-serif",
      ].join(","),
      htmlFontSize: scale.htmlFontSize,
      fontSize: scale.base,
      h6: {
        fontWeight: 700,
        letterSpacing: "-0.01em",
      },
      subtitle1: {
        fontWeight: 600,
      },
      subtitle2: {
        fontWeight: 600,
      },
      body1: {
        fontSize: `${scale.base}px`,
        lineHeight: 1.5,
      },
      body2: {
        fontSize: `${scale.base - 0.5}px`,
        lineHeight: 1.45,
      },
      caption: {
        fontSize: `${Math.max(scale.base - 2.5, 11)}px`,
        lineHeight: 1.3,
      },
      button: {
        textTransform: "none",
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 10,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollbarColor: isDark ? "#374151 #1F2937" : "#D1D5DB #F3F4F6",
            "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
              width: 6,
              height: 6,
            },
            "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
              borderRadius: 4,
              backgroundColor: isDark ? "#374151" : "#D1D5DB",
            },
            "&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track": {
              backgroundColor: isDark ? "#1F2937" : "#F8F9FB",
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            boxShadow: "none",
            "&:hover": {
              boxShadow: "none",
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            transition: "all 150ms ease",
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 600,
            fontSize: "0.8125rem",
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            paddingTop: compactList ? 6 : 10,
            paddingBottom: compactList ? 6 : 10,
            transition: "all 150ms ease",
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            fontSize: "0.875rem",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: isDark ? BORDER_DEFAULT_DARK : BORDER_DEFAULT_LIGHT,
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: PURPLE_PRIMARY,
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: PURPLE_PRIMARY,
              borderWidth: "1.5px",
            },
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
  });
}