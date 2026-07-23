import React, { type ReactNode } from "react";
import Link from "next/link";
import clsx from "clsx";

export type CardsProps = {
  /** Centers the cards when they don't fill the row */
  centered?: boolean;
  children: ReactNode;
  className?: string;
};

export function Cards({ centered, children, className }: CardsProps) {
  return (
    <section
      className={clsx(
        "gap-6 mt-8 w-full mx-auto max-w-5xl",
        centered
          ? "flex flex-wrap justify-center *:w-full sm:*:w-[calc(50%-12px)] lg:*:w-[calc(33.333%-16px)]"
          : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        className,
      )}
    >
      {children}
    </section>
  );
}

Cards.Card = Card;

export type CardProps = {
  /** Display title for the card */
  title: string;
  /** Subtitle (e.g. package name) shown below the title */
  subtitle?: string;
  /** Icon element rendered in the card center */
  icon: ReactNode;
  /** Internal link for the main card body */
  mainLink?: string;
  /** Custom children (e.g. floating external links) */
  children?: ReactNode;
  /** Disabled state */
  disabled?: boolean;
  /** Badge text */
  badge?: string;
};

export function Card({
  title,
  subtitle,
  icon,
  mainLink,
  disabled,
  badge,
  children,
}: CardProps) {
  const cardContent = (
    <>
      <div
        className={clsx(
          "flex h-14 w-14 items-center justify-center transition-transform duration-300 [&>svg]:w-full [&>svg]:h-full",
          !disabled && "group-hover:scale-110",
        )}
      >
        {icon}
      </div>
      <h3 className="mt-5 mb-1 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
        {title}
      </h3>
      {subtitle && (
        <div className="font-mono text-sm text-neutral-500 dark:text-neutral-400">
          {subtitle}
        </div>
      )}
    </>
  );

  const innerClassName = clsx(
    "flex-1 p-7 flex flex-col items-center justify-center text-center rounded-md transition-colors w-full h-full",
    !disabled && "hover:bg-neutral-200/50 dark:hover:bg-white/3",
  );

  return (
    <article
      className={clsx(
        "group relative flex min-h-65 flex-col rounded-md",
        "border border-neutral-200 bg-panel-surface",
        "dark:border-neutral-800",
        "transition-[border-color,box-shadow,transform] duration-300",
        !disabled &&
          "hover:border-neutral-300 hover:shadow-sm dark:hover:border-neutral-700",
        disabled && "opacity-50 grayscale cursor-default",
      )}
    >
      {badge && (
        <span className="absolute top-0 right-0 px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase rounded-tr-md rounded-bl-xl border-b border-l border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 z-10">
          {badge}
        </span>
      )}

      {children}

      {/* main card link */}
      {mainLink ? (
        <Link className={innerClassName} href={mainLink}>
          {cardContent}
        </Link>
      ) : (
        <div className={innerClassName}>{cardContent}</div>
      )}
    </article>
  );
}
