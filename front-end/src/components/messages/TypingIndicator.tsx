import { Box, Typography } from "@mui/material";

const TypingIndicator = () => {
  return (
    <Box display="flex" alignItems="center" gap={0.5}>
      <Typography
        variant="body2"
        sx={{ color: "#25D366", fontWeight: 600 }} // WhatsApp green
      >
        Typing
      </Typography>
      <Box display="flex" gap={0.3}>
        <Box
          sx={{
            width: 6,
            height: 6,
            bgcolor: "#25D366", // WhatsApp green
            borderRadius: "50%",
            animation: "bounce 1.4s infinite",
          }}
        />
        <Box
          sx={{
            width: 6,
            height: 6,
            bgcolor: "#25D366",
            borderRadius: "50%",
            animation: "bounce 1.4s infinite",
            animationDelay: "0.2s",
          }}
        />
        <Box
          sx={{
            width: 6,
            height: 6,
            bgcolor: "#25D366",
            borderRadius: "50%",
            animation: "bounce 1.4s infinite",
            animationDelay: "0.4s",
          }}
        />
      </Box>

      {/* Keyframes for bounce animation */}
      <style>
        {`
          @keyframes bounce {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1); }
          }
        `}
      </style>
    </Box>
  );
};

export default TypingIndicator;
