import clsx from "clsx";
import type { ElementType } from "react";
import { Outfit } from "next/font/google";

const outfit = Outfit({ subsets: ["latin"], weight: ["800"] });

type Props = {
  className?: string;
  as?: ElementType;
};

export function JsocGridText({ className, as: Component = "span" }: Props) {
  return (
    <Component
      className={clsx(
        "font-extrabold tracking-tight text-zinc-900 dark:text-white whitespace-nowrap",
        outfit.className,
        className,
      )}
    >
      JSOC <span className="text-gradient">GRID</span>
    </Component>
  );
}
