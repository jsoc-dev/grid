"use client";

import type { ReactNode } from "react";
import clsx from "clsx";
import { Check } from "lucide-react";

type ShowcaseCardProps = {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  selected?: boolean;
  onSelect?: () => void;
  /** "start": tile + optional check row, left-aligned text. "center": stacked. */
  align?: "start" | "center";
  /** "sm": compact tile/text. "md": large tile/text. */
  size?: "sm" | "md";
  /** "accent": static tinted look (core engine). "default": plain selectable card. */
  tone?: "default" | "accent";
  /** show a checkmark when selected (library cards, "start" align). */
  check?: boolean;
  /** render the icon as-is, without a tile (core engine). */
  bareIcon?: boolean;
  className?: string;
};

export function ShowcaseCard({
  icon,
  title,
  subtitle,
  selected = false,
  onSelect,
  align = "start",
  size = "md",
  tone = "default",
  check = false,
  bareIcon = false,
  className,
}: ShowcaseCardProps) {
  const interactive = tone === "default" && onSelect !== undefined;
  const strong = selected || tone === "accent";

  const tile = bareIcon ? (
    icon
  ) : (
    <div
      className={clsx(
        "flex shrink-0 items-center justify-center rounded-lg bg-white ring-1 ring-inset ring-neutral-200",
        size === "sm" ? "size-9" : "size-12",
        selected ? "text-accent-600" : "text-neutral-600",
      )}
    >
      {icon}
    </div>
  );

  const text = (
    <div className="w-full min-w-0">
      <div
        className={clsx(
          "font-semibold tracking-tight",
          size === "sm" ? "text-xs" : "truncate text-[15px]",
          strong
            ? "text-neutral-900 dark:text-white"
            : "text-neutral-700 dark:text-neutral-300",
        )}
      >
        {title}
      </div>
      {subtitle ? (
        <div
          className={clsx(
            "truncate font-mono text-neutral-400 dark:text-neutral-500",
            size === "sm"
              ? "text-[10px]"
              : "text-[11px] font-medium tracking-wider",
          )}
        >
          {subtitle}
        </div>
      ) : null}
    </div>
  );

  const body =
    align === "center" ? (
      <>
        {tile}
        {text}
      </>
    ) : (
      <>
        <div className="flex items-start justify-between">
          {tile}
          {check && selected ? (
            <Check className="size-4 shrink-0 text-accent-600 dark:text-accent-400" />
          ) : null}
        </div>
        {text}
      </>
    );

  const rootClassName = clsx(
    "flex min-w-0 flex-col rounded-xl border transition-all duration-200 outline-none",
    size === "sm" ? "gap-2 p-3.5" : "gap-3 p-5",
    align === "center" ? "items-center text-center" : "text-left",
    tone === "accent"
      ? "border-accent-500/30 bg-accent-50/50 shadow-xs dark:border-accent-500/20 dark:bg-accent-950/20"
      : "bg-white dark:bg-neutral-900",
    interactive && "cursor-pointer hover:scale-[1.02]",
    interactive &&
      (selected
        ? "border-accent-500 shadow-md dark:border-accent-400"
        : "border-neutral-200 hover:border-neutral-300 dark:border-neutral-800 dark:hover:border-neutral-700"),
    className,
  );

  if (interactive) {
    return (
      <button type="button" onClick={onSelect} className={rootClassName}>
        {body}
      </button>
    );
  }
  return <div className={rootClassName}>{body}</div>;
}
