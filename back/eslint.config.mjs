// @ts-check

import eslint from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    rules: {
      indent: ["error", 2],
      semi: ["error", "always"],
      quotes: ["error", "double"],
      "no-unused-vars": "warn",
      "no-console": "warn",
      "no-debugger": "warn",
      "prefer-const": "error",
      "eqeqeq": ["error", "always"],
      "no-var": "error",
      "curly": ["error", "all"],
    },
  },
  [globalIgnores(["generated/*"])],
);