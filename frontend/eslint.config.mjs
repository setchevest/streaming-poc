import { defineConfig, globalIgnores } from "eslint/config";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default defineConfig([
  globalIgnores([
    "**/node_modules/", // Ignores the node_modules directory
    ".git/",            // Ignores the .git directory
    "dist/",            // Ignores the dist directory
    "**/.next/",           // Ignores next directory
    ".swc/",            // Ignores test directory
    ".vscode/",         // Ignores vs code directory
    "*.config.mjs",     // Ignores all .config.mjs files
  ]),
  {
    extends: compat.extends(
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "next/core-web-vitals",
      "prettier",
    ),

    plugins: {
      "@typescript-eslint": typescriptEslint,
    },

    languageOptions: {
      parser: tsParser,
    },
  }]);