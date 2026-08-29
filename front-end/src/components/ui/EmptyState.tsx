/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode } from "react";
import { Box, Button, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  compact?: boolean;
}

const EmptyState = ({
  icon,
  title,
  description,
  actionText,
  onAction,
  compact = false,
}: EmptyStateProps) => {
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
        py: compact ? 4 : 6,
        height: "100%",
      }}
    >
      {icon !== undefined ? (
        <Box
          sx={{
            width: compact ? 52 : 64,
            height: compact ? 52 : 64,
            mb: 2,
            borderRadius: "18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            color: theme.palette.primary.light,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          }}
        >
          {icon}
        </Box>
      ) : null}
      <Typography
        variant="h6"
        sx={{ fontWeight: 700, mb: 0.75, fontSize: compact ? "1rem" : "1.1rem" }}
      >
        {title}
      </Typography>
      {description && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ maxWidth: 360, mb: actionText ? 2.5 : 0, lineHeight: 1.6 }}
        >
          {description}
        </Typography>
      )}
      {actionText && onAction && (
        <Button variant="contained" size="medium" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;