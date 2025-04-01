import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: "dist", // Ensure this matches your path
    emptyOutDir: true,
  },
  base: process.env.NODE_ENV === "production" ? "/" : "./",
});
