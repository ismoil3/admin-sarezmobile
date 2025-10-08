import path from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  // === 🔧 Плагинҳо ===
  plugins: [
    react(), // React HMR ва JSX
    tailwindcss(), // TailwindCSS дастгирӣ
  ],

  // === 📁 Alias ===
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // === 💻 Танзимоти Dev Server ===
  server: {
    host: true, // барои dev server дар LAN ё localhost
    port: 3000,
    open: true, // автоматик браузерро мекушояд
  },

  // === 🌐 Preview Server (барои Docker ё тест) ===
  preview: {
    host: "0.0.0.0", // лозим барои Docker
    port: 3001,
    allowedHosts: ["admin.sarezmobile.com", "www.admin.sarezmobile.com"],
  },

  // === 🏗️ Танзимоти Build ===
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false, // дар prod хатҳои debug-ро кам мекунад
    minify: "esbuild", // суръатнок месозад
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
        },
      },
    },
  },

  // === ⚙️ Optimization ва Cache Control ===
  optimizeDeps: {
    include: ["react", "react-dom"],
  },
});
