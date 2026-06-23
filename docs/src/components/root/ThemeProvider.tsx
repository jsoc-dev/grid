"use client";

import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from "next-themes";

/**
 * Root theme provider. Must wrap the app above nextra-theme-docs `Layout`, which
 * also mounts `ThemeProvider` — the nested instance skips its inline script when
 * context already exists.
 *
 * On the client, use a non-executable script type so React 19 does not warn about
 * `<script>` inside a component. SSR still emits a normal blocking script.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const scriptProps =
    typeof window === "undefined"
      ? undefined
      : ({ type: "application/json" } as const);

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      disableTransitionOnChange
      enableSystem
      scriptProps={scriptProps}
      storageKey="theme"
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
