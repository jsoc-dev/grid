"use client";

import { useTheme } from "next-themes";
import { useWindow } from "@/hooks/useWindow";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const win = useWindow();

  if (!win) return <ThemeToggleSkeleton />;

  const isDarkMode = resolvedTheme === "dark";
  const Icon = isDarkMode ? Moon : Sun;

  return (
    <button
      className="size-6"
      onClick={() => setTheme(isDarkMode ? "light" : "dark")}
      aria-label="Toggle theme"
      title={isDarkMode ? "dark mode" : "light mode"}
    >
      <Icon className="cursor-pointer" />
    </button>
  );
}

function ThemeToggleSkeleton() {
  return (
    <div className="size-6 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-800" />
  );
}
