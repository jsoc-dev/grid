import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";

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
