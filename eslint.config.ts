import path from "node:path";
import { fileURLToPath } from "node:url";

import js from "@eslint/js";
import type { ESLint, Linter } from "eslint";
import { defineConfig, globalIgnores } from "eslint/config";
import pluginImport from "eslint-plugin-import";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import pluginSimpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";
import tseslint from "typescript-eslint";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Subpath import rules for workspace packages and scripts. */
const packageImportRules = {
  "no-restricted-syntax": [
    "error",
    {
      selector: "ImportDeclaration[source.value=/^\\./]",
      message:
        "Use absolute paths (starting with #) instead of relative paths.",
    },
    {
      selector: "ImportDeclaration[source.value=/^#(?!.*\\.tsx?$).*/]",
      message:
        "Subpath imports (starting with #) must include the .ts or .tsx extension to ensure proper module resolution.",
    },
  ],
} satisfies Linter.RulesRecord;

export default defineConfig([
  globalIgnores([
    "**/dist/**",
    "**/node_modules/**",
    "docs/", // docs has its own eslint.config
    "examples/**", // examples have their own eslint.config
  ]),

  // Recommended JavaScript rules
  js.configs.recommended,

  // Recommended TypeScript rules (without type checking)
  ...tseslint.configs.recommended,

  // Additional rules and settings for all JS/JSX/TS/TSX files
  {
    files: ["**/*.{ts,tsx,js,jsx,mjs,cjs}"],

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        tsconfigRootDir: __dirname, // required since we have multiple tsconfig.json in examples/ which confuses eslint
      },
    },

    plugins: {
      import: pluginImport,
      "simple-import-sort": pluginSimpleImportSort,
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
    },

    settings: {
      "import/resolver": {
        typescript: true,
      },
    },
  },

  // React-specific rules and settings for React files
  {
    files: [
      "packages/react-grid/**/*.{ts,tsx}",
      "packages/react-grid-plugins/**/*.{ts,tsx}",
      "packages/react-grid-examples/**/*.{ts,tsx}",
    ],

    plugins: {
      react,
      "react-hooks": reactHooks as ESLint.Plugin,
    },

    rules: {
      "react/react-in-jsx-scope": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },

    settings: {
      react: {
        version: "detect",
      },
    },
  },

  // Type-aware linting for packages and scripts
  {
    files: ["packages/**/*.{ts,tsx}", "scripts/**/*.{ts,tsx}"],
    extends: [tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: {
        project: ["**/tsconfig.json", "**/tsconfig.node.json"],
        tsconfigRootDir: __dirname,
      },
    },
    rules: packageImportRules,
  },
]);
