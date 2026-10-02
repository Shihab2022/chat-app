import React from "react";
import { Box, Typography, Chip } from "@mui/material";
import { COLORS, GRADIENTS, gradientTextStyle } from "../styles";

interface SectionTitleProps {
  badge?: string;
  /** Words in this portion of the title render with the brand gradient. */
  title: string;
  /** Optional trailing text appended after {@link title} in a muted tone. */
  gradientWord?: string;
  subtitle?: string;
  center?: boolean;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  badge,
  title,
  gradientWord,
  subtitle,
  center = true,
}) => {
  return (
    <Box
      sx={{
        textAlign: center ? "center" : "left",
        mb: { xs: 5, md: 8 },
        maxWidth: center ? "720px" : "100%",
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
            fontWeight: 700,
            fontSize: "0.72rem",
            letterSpacing: "0.12em",
            color: "#E9D5FF",
            backgroundColor: "rgba(124, 77, 255, 0.14)",
            border: "1px solid rgba(124, 77, 255, 0.35)",
            borderRadius: "20px",
            textTransform: "uppercase",
          }}
        />
      )}
      <Typography
        variant="h3"
        component="h2"
        sx={{
          fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
          fontWeight: 800,
          color: "#FFFFFF",
          letterSpacing: "-0.02em",
          lineHeight: 1.15,
          mb: 2,
        }}
      >
        {title}
        {gradientWord && (
          <>
            {" "}
            <Box component="span" sx={gradientTextStyle}>
              {gradientWord}
            </Box>
          </>
        )}
      </Typography>
      {subtitle && (
        <Typography
          variant="body1"
          sx={{
            color: COLORS.textSecondary,
            fontSize: { xs: "1rem", sm: "1.1rem" },
            lineHeight: 1.7,
          }}
        >
          {subtitle}
        </Typography>
      )}

      {/* Gradient underline accent */}
      <Box
        sx={{
          mt: 3,
          height: 4,
          width: 96,
          borderRadius: 4,
          background: GRADIENTS.brand,
          mx: center ? "auto" : 0,
          opacity: 0.9,
          boxShadow: "0 0 20px rgba(124, 77, 255, 0.6)",
        }}
      />
    </Box>
  );
};
