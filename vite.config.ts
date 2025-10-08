import path from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  preview: {
    host: "0.0.0.0",
    port: 3000,
    allowedHosts: ["admin.sarezmobile.com", "www.admin.sarezmobile.com"],
  },

  server: {
    host: "0.0.0.0",
    allowedHosts: ["admin.sarezmobile.com", "www.admin.sarezmobile.com"],
  },
});
