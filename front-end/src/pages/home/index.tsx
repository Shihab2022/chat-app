import React from "react";
import { Box, CssBaseline } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { HeroSection } from "./HeroSection";
import { FeaturesSection } from "./FeaturesSection";
import { StatsSection } from "./StatsSection";
import { HowItWorks } from "./HowItWorks";
import { Testimonials } from "./Testimonials";
import { CTASection } from "./CTASection";
import { Footer } from "./Footer";
import { FadeInWrapper } from "./FadeInWrapper";
import { THEME_COLORS } from "../../config/constants";

const customTheme = createTheme({
  palette: {
    primary: {
      main: THEME_COLORS.primary,
    },
    secondary: {
      main: THEME_COLORS.secondary,
    },
    background: {
      default: THEME_COLORS.background,
    },
    text: {
      primary: THEME_COLORS.textPrimary,
      secondary: THEME_COLORS.textSecondary,
    },
  },
  typography: {
    fontFamily:
      '"Plus Jakarta Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
});

export const HomePage: React.FC = () => {
  return (
    <>
      <ThemeProvider theme={customTheme}>
        <CssBaseline />
        <Box
          sx={{ minHeight: "100vh", backgroundColor: THEME_COLORS.background }}
        >
          <HeroSection />

          <FadeInWrapper>
            <FeaturesSection />
          </FadeInWrapper>

          <FadeInWrapper>
            <StatsSection />
          </FadeInWrapper>

          <FadeInWrapper>
            <HowItWorks />
          </FadeInWrapper>

          <FadeInWrapper>
            <Testimonials />
          </FadeInWrapper>

          <FadeInWrapper>
            <CTASection />
          </FadeInWrapper>

          <Footer />
        </Box>
      </ThemeProvider>
    </>
  );
};
