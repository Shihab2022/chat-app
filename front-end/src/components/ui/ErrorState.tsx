/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode } from "react";
import { Box, Button, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  icon?: ReactNode;
}

const ErrorState = ({
  title = "Something went wrong",
  description = "We couldn't load this content. Please try again.",
  onRetry,
  icon,
}: ErrorStateProps) => {
  const theme = useTheme();
  return (
    <Box
      className="animate-fade-in"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        px: 3,
        py: 6,
        height: "100%",
      }}
    >
      <Box
        sx={{
          width: 60,
          height: 60,
          borderRadius: "18px",
          mb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: alpha(theme.palette.error.main, 0.12),
          color: theme.palette.error.main,
          border: `1px solid ${alpha(theme.palette.error.main, 0.22)}`,
        }}
      >
        {icon || <ErrorOutlineRoundedIcon sx={{ fontSize: 30 }} />}
      </Box>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.75 }}>
        {title}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ maxWidth: 360, mb: onRetry ? 2.5 : 0, lineHeight: 1.6 }}
      >
        {description}
      </Typography>
      {onRetry && (
        <Button variant="contained" size="medium" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </Box>
  );
};

export default ErrorState;