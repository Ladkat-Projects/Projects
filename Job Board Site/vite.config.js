import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true, // Ensures the app is accessible on the local network.
    port: 3000, // Default port for the development server.
  },
  build: {
    outDir: "dist", // Confirms the default output folder for Vercel deployment.
    emptyOutDir: true, // Clears the `dist` folder before rebuilding.
  },
});
