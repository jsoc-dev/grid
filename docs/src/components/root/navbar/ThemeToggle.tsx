"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const isDark = resolvedTheme === "dark";
  const Icon = isDark ? Moon : Sun;

  return (
    <div className="h-6 w-6">
      {mounted && (
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          title={isDark ? "dark mode" : "light mode"}
        >
          <Icon className="cursor-pointer" />
        </button>
      )}
    </div>
  );
}
