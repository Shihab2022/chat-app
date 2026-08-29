import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import logoImage from "../../assets/logo.png";

interface LogoProps {
  size?: number;
  showText?: boolean;
  onClick?: () => void;
  variant?: "light" | "dark";
}

/**
 * Chatty brand lockup.
 */
const Logo = ({ size = 34, showText = true, onClick }: LogoProps) => {
  const theme = useTheme();
  return (
    <Box
      onClick={onClick}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.25,
        cursor: onClick ? "pointer" : "default",
        userSelect: "none",
      }}
    >
      <Box
        component="img"
        src={logoImage}
        alt="Chatty logo"
        sx={{
          width: size,
          height: size,
          borderRadius: 2,
          objectFit: "cover",
          boxShadow: `0 2px 10px ${theme.palette.primary.main}40`,
        }}
      />
      {showText && (
        <Typography
          variant="h6"
          sx={{
            fontWeight: 800,
            letterSpacing: "-0.02em",
            fontSize: Math.max(16, Math.round(size * 0.52)),
            color: theme.palette.text.primary,
          }}
        >
          Chatty
        </Typography>
      )}
    </Box>
  );
};

export default Logo;