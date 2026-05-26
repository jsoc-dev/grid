export type ColorScheme = "dark" | "light";

const COLOR_SCHEME_QUERY = "(prefers-color-scheme: dark)";

/**
 * Reads the OS / browser preferred color scheme.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/color-scheme|Color Scheme}
 */
export function detectColorScheme(): ColorScheme {
  return window.matchMedia(COLOR_SCHEME_QUERY).matches ? "dark" : "light";
}

/**
 * Subscribes to preferred color scheme changes (e.g. OS dark mode toggle).
 */
export function subscribeColorScheme(
  listener: (colorScheme: ColorScheme) => void,
): () => void {
  const matcher = window.matchMedia(COLOR_SCHEME_QUERY);

  const onChange = (event: MediaQueryListEvent) => {
    listener(event.matches ? "dark" : "light");
  };

  matcher.addEventListener("change", onChange);

  return () => matcher.removeEventListener("change", onChange);
}
