import Box from "@mui/material/Box/Box";
import { Navbar } from "../../components/Navbar";
import { CTA } from "./CTA";
import { Features } from "./Features";
import { Footer } from "./Footer";
import { HeroSection } from "./Hero";
import { HowItWorks } from "./HowItWorks";
import { Preview } from "./Preview";
import { Testimonials } from "./Testimonials";
import { patternBackgroundStyle } from "../../styles";

const HomePage = () => {
  return (
    <Box
      sx={{
        ...patternBackgroundStyle,
        minHeight: "100vh",
        color: "#F8FAFC",
        overflowX: "hidden",
        position: "relative",
      }}
    >
      <Navbar />
      <HeroSection />
      <Features />
      <HowItWorks />
      <Preview />
      <Testimonials />
      <CTA />
      <Footer />
    </Box>
  );
};

export default HomePage;
