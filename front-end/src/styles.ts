export const COLORS = {
  primary: "#7C4DFF",
  primaryLight: "#B388FF",
  primaryDark: "#651FFF",
  secondary: "#00E5FF",
  secondaryDark: "#00B8D4",
  bgDefault: "#0F172A",
  bgPaper: "#1E293B",
  textPrimary: "#F8FAFC",
  textSecondary: "#94A3B8",
};

export const glassStyle = {
  background: "rgba(30, 41, 59, 0.55)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
  borderRadius: "20px",
};

// Circular pattern with linear color transition
export const patternBackgroundStyle = {
  backgroundColor: "#0F172A",
  backgroundImage: `
    repeating-radial-gradient(
      circle at 0 0,
      rgba(255, 255, 255, 0.08) 0px,
      rgba(255, 255, 255, 0.08) 2px,
      transparent 2px,
      transparent 24px
    ),
    linear-gradient(
      135deg, 
      rgba(124, 77, 255, 0.25) 0%, 
      rgba(0, 229, 255, 0.25) 100%
    )
  `,
};
