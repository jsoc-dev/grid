import path from "node:path";
import { fileURLToPath } from "node:url";

import js from "@eslint/js";
import type { ESLint } from "eslint";
import { defineConfig, globalIgnores } from "eslint/config";
import pluginImport from "eslint-plugin-import";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import pluginSimpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";
import tseslint from "typescript-eslint";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig([
  globalIgnores(["**/dist/**", "**/node_modules/**"]),

  // Base JS config
  js.configs.recommended,

  // TypeScript config
  ...tseslint.configs.recommended,

  {
    files: ["**/*.{ts,tsx,js,jsx}"],

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },

    plugins: {
      import: pluginImport,
      "simple-import-sort": pluginSimpleImportSort,
      react,
      "react-hooks": reactHooks as ESLint.Plugin,
    },

    rules: {
      // ------------TYPESCRIPT---------------
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          fixStyle: "separate-type-imports",
        },
      ],
      "@typescript-eslint/no-import-type-side-effects": "error",

      // ------------IMPORT SORTING-----------
      "import/order": "off",
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            // Side effect imports (rare, usually CSS etc)
            ["^\\u0000"],
            // Relative imports
            ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
            ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
            // Internal aliases
            ["^@/", "^#"],
            // Node builtins
            ["^node:"],
            // External packages
            ["^@?\\w"],
          ],
        },
      ],
      "simple-import-sort/exports": "error",

      // --------------REACT------------------
      "react/react-in-jsx-scope": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },

    settings: {
      react: {
        version: "detect",
      },
      "import/resolver": {
        typescript: true,
      },
    },
  },

  // type checks for packages/**
  ...tseslint.configs.recommendedTypeChecked.map((c) => ({
    ...c,
    files: ["packages/**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "ImportDeclaration[source.value=/^\\./]",
          message:
            "Use absolute paths (starting with #) instead of relative paths.",
        },
      ],
    },
  })),
]);
