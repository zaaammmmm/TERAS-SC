import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/auth": "https://backend-terassc.vercel.app",
      "/api": "https://backend-terassc.vercel.app",
    },
  },
});
