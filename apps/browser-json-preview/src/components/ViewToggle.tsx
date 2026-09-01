import type { View } from "#types.ts";

import clsx from "clsx";

export type ViewToggleProps = {
  view: View;
  onViewChange: (view: View) => void;
  defaultView: View;
  onDefaultChange: (view: View) => void;
};

const VIEWS: { value: View; label: string }[] = [
  { value: "raw", label: "Raw" },
  { value: "table", label: "Table" },
];

export function ViewToggle({
  view,
  onViewChange,
  defaultView,
  onDefaultChange,
}: ViewToggleProps) {
  const isCurrentDefault = view === defaultView;

  return (
    <div className="fixed right-4 bottom-4 z-50 flex items-center bg-canvas text-canvastext border border-border rounded-full shadow-lg p-1 text-xs select-none">
      <div className="flex items-center gap-0.5">
        {VIEWS.map(({ value, label }) => {
          const isActive = view === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => onViewChange(value)}
              className={clsx(
                "px-3 py-1 rounded-full font-medium transition-colors cursor-pointer",
                isActive
                  ? "bg-focus text-canvas font-semibold shadow-xs"
                  : "text-canvastext hover:bg-hover opacity-75 hover:opacity-100",
              )}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="w-px h-3.5 bg-border mx-1" />

      <button
        type="button"
        disabled={isCurrentDefault}
        onClick={() => onDefaultChange(view)}
        title={
          isCurrentDefault
            ? `${view === "table" ? "Table" : "Raw"} view is set as default`
            : `Set ${view === "table" ? "Table" : "Raw"} view as default`
        }
        className={clsx(
          "p-1.5 rounded-full transition-all flex items-center justify-center",
          isCurrentDefault
            ? "text-focus opacity-90 cursor-default"
            : "opacity-60 hover:opacity-100 hover:bg-hover cursor-pointer hover:scale-110",
        )}
      >
        <PinIcon filled={isCurrentDefault} className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

function PinIcon({
  filled,
  className,
}: {
  filled?: boolean;
  className?: string;
}) {
  if (filled) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
      >
        <path d="M16 3a1 1 0 0 1 .117 1.993L16 5v4.586l1.707 1.707a1 1 0 0 1 .286.602L18 12v2a1 1 0 0 1-.883.993L17 15h-4v6a1 1 0 0 1-1.993.117L11 21v-6H7a1 1 0 0 1-.993-.883L6 14v-2a1 1 0 0 1 .206-.608l.087-.099L8 9.586V5a1 1 0 0 1-.117-1.993L8 3h8z" />
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="12" y1="17" x2="12" y2="22" />
      <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V5h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v5.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z" />
    </svg>
  );
}
