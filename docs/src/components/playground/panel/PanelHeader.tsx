import clsx from "clsx";
import type { LucideIcon } from "lucide-react";
import { Children, type MouseEventHandler, type ReactNode } from "react";

type PanelHeaderProps = {
  heading: string;
  children?: ReactNode;
};

export function PanelHeader({ heading, children }: PanelHeaderProps) {
  const buttons = Children.toArray(children);

  return (
    <div className="flex items-center justify-between h-7">
      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
        {heading}
      </span>
      {buttons.length > 0 && (
        <div className="flex items-center gap-2 shrink-0">{buttons}</div>
      )}
    </div>
  );
}

PanelHeader.Button = PanelHeaderButton;

type PanelHeaderButtonProps = {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  Icon: LucideIcon;
  label: string;
  disabled?: boolean;
  className?: string;
};

function PanelHeaderButton({
  onClick,
  Icon,
  label,
  className,
  disabled,
}: PanelHeaderButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={clsx(
        "flex items-center gap-1.5 rounded-full bg-white/80",
        "backdrop-blur-sm px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500 border border-zinc-200",
        "shadow-sm transition-all",
        "dark:bg-zinc-900/80 dark:border-zinc-700",
        disabled
          ? "opacity-50 cursor-not-allowed"
          : "cursor-pointer hover:bg-white hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100",
        className,
      )}
    >
      <Icon className="h-3 w-3 shrink-0" />
      {label}
    </button>
  );
}
