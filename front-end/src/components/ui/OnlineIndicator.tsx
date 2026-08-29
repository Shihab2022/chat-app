import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";

interface OnlineIndicatorProps {
  online?: boolean;
  size?: "small" | "medium" | number;
}

export default function OnlineIndicator({ online = false, size = "medium" }: OnlineIndicatorProps) {
  const theme = useTheme();
  const dotSize = size === "small" ? 8 : size === "medium" ? 10 : typeof size === "number" ? size : 10;
  const bg = online ? theme.palette.success.main : theme.palette.text.secondary;
  return (
    <Box
      sx={{
        width: dotSize,
        height: dotSize,
        borderRadius: "50%",
        backgroundColor: bg,
        border: `2px solid ${alpha(theme.palette.background.paper, 0.9)}`,
        flexShrink: 0,
      }}
      aria-label={online ? "online" : "offline"}
    />
  );
}
