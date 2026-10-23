/* ─────────────────────────────────────────────────────────────
 * Chatty marketing design tokens.
 * Single source of truth for the landing page palette so every
 * section (Hero, Features, Dashboard showcase, CTA, Footer…)
 * shares the same modern violet → cyan brand gradients.
 * ───────────────────────────────────────────────────────────── */

export const COLORS = {
  primary: "#7C4DFF",
  primaryLight: "#A78BFA",
  primaryDark: "#6C3CE9",
  secondary: "#00E5FF",
  secondaryDark: "#00B8D4",
  accent: "#FF4081",
  success: "#10B981",
  warning: "#F59E0B",
  bgDefault: "#070B18",
  bgDeep: "#0B1224",
  bgPaper: "rgba(255, 255, 255, 0.04)",
  textPrimary: "#F8FAFC",
  textSecondary: "#94A3B8",
};

/** Brand gradient presets used across buttons, badges and text. */
export const GRADIENTS = {
  brand: "linear-gradient(135deg, #7C4DFF 0%, #00E5FF 100%)",
  brandReverse: "linear-gradient(135deg, #00E5FF 0%, #7C4DFF 100%)",
  violet: "linear-gradient(135deg, #7C4DFF 0%, #A855F7 100%)",
  cyan: "linear-gradient(135deg, #0EA5E9 0%, #00E5FF 100%)",
  pink: "linear-gradient(135deg, #FF4081 0%, #A855F7 100%)",
  emerald: "linear-gradient(135deg, #10B981 0%, #00E5FF 100%)",
  amber: "linear-gradient(135deg, #F59E0B 0%, #FF4081 100%)",
  indigo: "linear-gradient(135deg, #6366F1 0%, #7C4DFF 100%)",
  surface:
    "linear-gradient(160deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)",
  mesh: `
    radial-gradient(circle at 12% 8%, rgba(124, 77, 255, 0.28) 0%, transparent 45%),
    radial-gradient(circle at 88% 12%, rgba(0, 229, 255, 0.18) 0%, transparent 42%),
    radial-gradient(circle at 50% 100%, rgba(255, 64, 129, 0.16) 0%, transparent 50%)
  `,
};

/** Gradient-filled text (used for headline accents). */
export const gradientTextStyle = {
  background: GRADIENTS.brand,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  display: "inline-block",
};

export const glassStyle = {
  background: "rgba(17, 24, 39, 0.55)",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
  border: "1px solid rgba(255, 255, 255, 0.09)",
  boxShadow: "0 8px 32px 0 rgba(2, 6, 23, 0.45)",
  borderRadius: "20px",
};

/** Dark canvas with a soft mesh gradient + subtle grid. */
export const patternBackgroundStyle = {
  backgroundColor: COLORS.bgDefault,
  backgroundImage: `
    ${GRADIENTS.mesh},
    linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px)
  `,
  backgroundSize: "100% 100%, 100% 100%, 48px 48px, 48px 48px",
  backgroundPosition: "0 0, 0 0, -1px -1px, -1px -1px",
  backgroundAttachment: "fixed",
};

// Light chat wallpaper (WhatsApp-inspired beige with subtle pattern)
export const chatPatternBackgroundStyle = {
  backgroundColor: "#EFEAE2",
  backgroundImage: `
    radial-gradient(circle at 18% 22%, rgba(0, 102, 204, 0.045) 0%, transparent 40%),
    radial-gradient(circle at 80% 72%, rgba(0, 168, 132, 0.04) 0%, transparent 38%),
    linear-gradient(rgba(17, 27, 33, 0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(17, 27, 33, 0.025) 1px, transparent 1px)
  `,
  backgroundSize: "100% 100%, 100% 100%, 28px 28px, 28px 28px",
  backgroundPosition: "0 0, 0 0, -1px -1px, -1px -1px",
};
