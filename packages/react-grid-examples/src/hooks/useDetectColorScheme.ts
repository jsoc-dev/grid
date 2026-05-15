import { useEffect, useState } from "react";

/**
 * Hook to detect theme preference
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/color-scheme|Color Scheme} for more info
 */
export function useDetectColorScheme() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const matcher = window.matchMedia("(prefers-color-scheme: dark)");

    const onChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };

    matcher.addEventListener("change", onChange);

    return () => matcher.removeEventListener("change", onChange);
  }, []);

  return isDarkMode ? "dark" : "light";
}
