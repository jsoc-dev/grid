import type { SvgIcon } from "@/types/svg";
import clsx from "clsx";

type Props = {
  icon: SvgIcon;
  label: string;
  isSelected: boolean;
  onClick: () => void;
};

export function Switch({ icon: Icon, label, isSelected, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "relative flex flex-col items-center gap-1 px-2.5 py-2 text-[10px] font-medium transition-colors shrink-0 cursor-pointer",
        "md:gap-1.5 md:px-4 md:py-3 md:text-xs",
        isSelected
          ? "text-accent-600 dark:text-accent-400"
          : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-500 dark:hover:text-zinc-300",
      )}
    >
      <Icon width="22" height="22" className="shrink-0" />

      <span>{label}</span>

      {isSelected && (
        <span
          className={clsx(
            "absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-accent-500",
          )}
        />
      )}
    </button>
  );
}
