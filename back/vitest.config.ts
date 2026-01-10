import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "src": path.resolve(__dirname, "src"),
    },
  },
  test: {
    environment: "node",
    globals: true,
    include: ["src/tests/**/*.spec.ts"],
    exclude: ["node_modules", "dist"],
    setupFiles: ["src/tests/setup.ts"],
    clearMocks: true,
    restoreMocks: true,
  },
});
