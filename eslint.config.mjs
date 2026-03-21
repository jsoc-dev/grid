import pluginJs from "@eslint/js";
import pluginImport from "eslint-plugin-import";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginSimpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";
import tseslint from "typescript-eslint";

/** Common flat config rules for all projects. (import-sorting, type-imports) */
export const commonConfig = {
  plugins: {
    import: pluginImport,
    "simple-import-sort": pluginSimpleImportSort,
  },
  rules: {
    "@typescript-eslint/consistent-type-imports": [
      "error",
      {
        prefer: "type-imports",
        fixStyle: "separate-type-imports",
      },
    ],
    "@typescript-eslint/no-import-type-side-effects": "error",
    "import/order": "off",
    // https://github.com/lydell/eslint-plugin-simple-import-sort
    "simple-import-sort/imports": [
      "error",
      {
        groups: [
          // Type imports
          // ["\\u0000$"], // commented since not matching imports like: import type { A } from "x"
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
};

/** Base configuration for all TypeScript files */
export const baseConfig = tseslint.config(
  {
    ignores: ["**/node_modules/", "**/dist/", "**/coverage/", "**/build/"],
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  commonConfig,
);

/** React-specific configuration */
export const reactConfig = tseslint.config({
  files: ["**/*.{ts,tsx}"],
  plugins: {
    "react-hooks": pluginReactHooks,
    react: pluginReact,
  },
  languageOptions: {
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    ...pluginReactHooks.configs.recommended.rules,
    ...pluginReact.configs.recommended.rules,
    "react/react-in-jsx-scope": "off",
  },
});

/** Global fallback configuration */
export default tseslint.config(...baseConfig, {
  files: ["**/*.tsx"],
  ...reactConfig[0],
});
