export type CardGridProps = {
  cards: {
    label: string;
    icon: ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    badge?: string;
  }[];
};

export default function CardGrid({ cards }: CardGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
      {cards.map((card, index) => (
        <IconCard
          key={index}
          label={card.label}
          icon={card.icon}
          onClick={card.onClick}
          disabled={card.disabled}
          badge={card.badge}
        />
      ))}
    </div>
  );
}

import React, { type ReactNode } from "react";
import clsx from "clsx";

export type IconCardProps = {
  icon: ReactNode;
  label: string;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  badge?: string;
};

export function IconCard({
  icon,
  label,
  className,
  onClick,
  disabled = false,
  badge,
}: IconCardProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        // Layout & Spacing
        "relative flex flex-col items-center justify-center gap-6 p-8 sm:p-10 rounded-2xl",
        "transition-all duration-300 border text-center group w-full",

        // Colors & Theme
        "bg-white border-neutral-200 text-neutral-900 shadow-sm",
        !disabled && "hover:border-neutral-300 hover:shadow-md",

        // Dark mode
        "dark:bg-[#161616] dark:border-neutral-800 dark:text-neutral-100",
        !disabled && "dark:hover:border-neutral-700",

        // Interactivity
        disabled
          ? "opacity-40 cursor-default grayscale"
          : "cursor-pointer active:scale-[0.98]",

        className,
      )}
    >
      {badge && (
        <span className="absolute top-0 right-0 px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase rounded-tr-2xl rounded-bl-xl border-b border-l border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          {badge}
        </span>
      )}
      <div
        className={clsx(
          "w-12 h-12 flex items-center justify-center transition-transform duration-300",
          !disabled && "group-hover:scale-110",
        )}
      >
        {icon}
      </div>

      <span className="text-lg font-semibold tracking-tight">{label}</span>
    </button>
  );
}
