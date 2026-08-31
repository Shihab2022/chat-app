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
    // harper.js resolves its WebAssembly binary with
    // `new URL("harper_wasm_bg.wasm", import.meta.url)`, which only works when
    // the package is served as-is (not pre-bundled into node_modules/.vite).
    exclude: ["harper.js"],
  },
});
