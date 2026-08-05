import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";

const TypingIndicator = () => {
  const theme = useTheme();
  const indicatorColor = theme.palette.success.main;

  return (
    <Box display="flex" alignItems="center" gap={0.75} sx={{ py: 0.25 }}>
      <Typography
        variant="caption"
        sx={{
          color: indicatorColor,
          fontWeight: 600,
          fontSize: "0.75rem",
          lineHeight: 1,
        }}
      >
        typing
      </Typography>
      <Box display="flex" alignItems="center" gap={0.4}>
        {[0, 0.2, 0.4].map((delay, index) => (
          <Box
            key={index}
            sx={{
              width: 5,
              height: 5,
              bgcolor: indicatorColor,
              borderRadius: "50%",
              animation: "typingBounce 1.4s infinite ease-in-out",
              animationDelay: `${delay}s`,
            }}
          />
        ))}
      </Box>

      <style>
        {`
          @keyframes typingBounce {
            0%, 80%, 100% { transform: scale(0); opacity: 0.4; }
            40% { transform: scale(1); opacity: 1; }
          }
        `}
      </style>
    </Box>
  );
};

export default TypingIndicator;
