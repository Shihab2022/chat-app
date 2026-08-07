import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      "@mui/material",
      "@mui/material/styles",
      "@mui/icons-material",
      "@mui/lab",
      "@emotion/react",
      "@emotion/styled",
    ],
  },
});
