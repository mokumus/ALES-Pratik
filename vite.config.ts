import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base: "./" sayesinde derlenmiş dosyalar hem GitHub Pages proje adresinde
// (kullanici.github.io/ALES-Pratik/) hem de alan adı kökünde çalışır.
export default defineConfig({
  base: "./",
  plugins: [react()],
  build: {
    outDir: "dist",
    sourcemap: false,
  },
});
