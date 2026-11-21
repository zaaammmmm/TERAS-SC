import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiBaseUrl = env.VITE_API_BASE_URL;

  if (!apiBaseUrl) {
    throw new Error("VITE_API_BASE_URL wajib diatur di file .env");
  }

  return {
    plugins: [react()],
    base: '/terassc',
    server: {
      proxy: {
        "/auth": apiBaseUrl,
        "/rooms": apiBaseUrl,
        "/bookings": apiBaseUrl,
        "/api": apiBaseUrl,
      },
    },
  };
});
