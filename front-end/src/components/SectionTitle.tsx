import React from "react";
import { Box, Typography, Chip } from "@mui/material";
import { COLORS } from "../styles";

interface SectionTitleProps {
  badge?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  badge,
  title,
  subtitle,
  center = true,
}) => {
  return (
    <Box
      sx={{
        textAlign: center ? "center" : "left",
        mb: { xs: 5, md: 8 },
        maxWidth: center ? "700px" : "100%",
        mx: center ? "auto" : 0,
      }}
    >
      {badge && (
        <Chip
          label={badge}
          size="small"
          sx={{
            mb: 2,
            px: 1,
            py: 0.5,
            fontWeight: 600,
            fontSize: "0.8rem",
            color: "#0066CC",
            backgroundColor: "rgba(0, 102, 204, 0.08)",
            border: "1px solid rgba(0, 102, 204, 0.25)",
            borderRadius: "20px",
          }}
        />
      )}
      <Typography
        variant="h3"
        component="h2"
        sx={{
          fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
          fontWeight: 800,
          color: "#111B21",
          mb: 2,
        }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography
          variant="body1"
          sx={{
            color: COLORS.textSecondary,
            fontSize: { xs: "1rem", sm: "1.125rem" },
            lineHeight: 1.6,
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );
};
