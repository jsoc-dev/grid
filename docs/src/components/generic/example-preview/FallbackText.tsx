import clsx from "clsx";
import type { ReactNode } from "react";

type Props = {
  className?: string;
  children: ReactNode;
};

export function FallbackText({ className, children }: Props) {
  return (
    <div
      className={clsx(
        "h-full w-full flex items-center justify-center border",
        "border-zinc-300 dark:border-zinc-600/50",
        className,
      )}
    >
      {children}
    </div>
  );
}
