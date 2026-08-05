import React from "react";
import { Box, Typography, Chip } from "@mui/material";

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
            color: "#00E5FF",
            backgroundColor: "rgba(0, 229, 255, 0.1)",
            border: "1px solid rgba(0, 229, 255, 0.3)",
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
          background: "linear-gradient(135deg, #FFFFFF 0%, #94A3B8 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          mb: 2,
        }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography
          variant="body1"
          sx={{
            color: "text.secondary",
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
