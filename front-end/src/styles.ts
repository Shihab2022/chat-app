export const COLORS = {
  primary: "#0066CC",
  primaryLight: "#4D94E0",
  primaryDark: "#0050A3",
  secondary: "#00A884",
  secondaryDark: "#0B6E55",
  bgDefault: "#F0F2F5",
  bgPaper: "#FFFFFF",
  textPrimary: "#111B21",
  textSecondary: "#667781",
};

export const glassStyle = {
  background: "rgba(255, 255, 255, 0.72)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  border: "1px solid rgba(228, 230, 235, 0.9)",
  boxShadow: "0 8px 32px 0 rgba(15, 23, 42, 0.08)",
  borderRadius: "20px",
};

// Soft light canvas with subtle brand gradient
export const patternBackgroundStyle = {
  backgroundColor: "#F0F2F5",
  backgroundImage: `
    radial-gradient(circle at 15% 12%, rgba(0, 102, 204, 0.07) 0%, transparent 42%),
    radial-gradient(circle at 88% 85%, rgba(0, 168, 132, 0.06) 0%, transparent 40%),
    linear-gradient(rgba(15, 23, 42, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(15, 23, 42, 0.02) 1px, transparent 1px)
  `,
  backgroundSize: "100% 100%, 100% 100%, 40px 40px, 40px 40px",
  backgroundPosition: "0 0, 0 0, -1px -1px, -1px -1px",
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
