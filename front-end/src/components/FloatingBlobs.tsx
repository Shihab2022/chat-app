import React from "react";
import { Box } from "@mui/material";
import { keyframes } from "@emotion/react";

const float1 = keyframes`
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
`;

const float2 = keyframes`
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(-40px, 30px) scale(1.15); }
  66% { transform: translate(25px, -35px) scale(0.85); }
`;

export const FloatingBlobs: React.FC = () => {
  return (
    <Box
      aria-hidden="true"
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "10%",
          left: "15%",
          width: { xs: "250px", md: "450px" },
          height: { xs: "250px", md: "450px" },
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(0, 102, 204, 0.10) 0%, rgba(0,0,0,0) 70%)",
          filter: "blur(80px)",
          animation: `${float1} 18s infinite ease-in-out`,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: "55%",
          right: "10%",
          width: { xs: "300px", md: "500px" },
          height: { xs: "300px", md: "500px" },
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(0, 168, 132, 0.08) 0%, rgba(0,0,0,0) 70%)",
          filter: "blur(90px)",
          animation: `${float2} 22s infinite ease-in-out`,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "5%",
          left: "20%",
          width: { xs: "200px", md: "400px" },
          height: { xs: "200px", md: "400px" },
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(0, 102, 204, 0.08) 0%, rgba(0,0,0,0) 70%)",
          filter: "blur(100px)",
          animation: `${float1} 25s infinite ease-in-out reverse`,
        }}
      />
    </Box>
  );
};
