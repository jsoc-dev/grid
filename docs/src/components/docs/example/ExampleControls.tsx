import { useExamplePreview } from "@/contexts/ExamplePreviewContext";
import clsx from "clsx";
import { Code2, ExternalLink, RotateCcw } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

export function ExampleControls({
  showCode,
  setShowCode,
}: {
  showCode: boolean;
  setShowCode: Dispatch<SetStateAction<boolean>>;
}) {
  const { openPreviewInNewTab, reloadPreview } = useExamplePreview();

  const controlButtons = [
    {
      title: "Open preview in new tab",
      Icon: ExternalLink,
      onClick: openPreviewInNewTab,
      disabled: false,
    },
    {
      title: "Reload preview",
      Icon: RotateCcw,
      onClick: reloadPreview,
      disabled: false,
    },
  ];

  return (
    <div className="flex justify-end">
      <button
        type="button"
        onClick={() => setShowCode(!showCode)}
        aria-label={showCode ? "Hide code" : "Show code"}
        title={showCode ? "Hide code" : "Show code"}
        className={clsx(
          "flex items-center justify-center transition-colors h-8 gap-2 rounded-lg border px-3 mr-2 text-sm font-medium",
          showCode
            ? "border-zinc-300 bg-zinc-100 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            : "border-zinc-200 text-zinc-600 dark:border-zinc-800 dark:text-zinc-400",
          "cursor-pointer hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100",
        )}
      >
        <Code2 className="h-4 w-4 shrink-0" />
        <span>Code</span>
      </button>

      {controlButtons.map(({ title, onClick, Icon, disabled }, index) => (
        <button
          key={index}
          onClick={onClick}
          title={title}
          type="button"
          className={clsx(
            "flex items-center justify-center transition-colors h-8 w-8 rounded-lg text-zinc-500 dark:text-zinc-400",
            disabled
              ? "cursor-not-allowed opacity-50"
              : "cursor-pointer hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100",
          )}
        >
          <Icon className="h-4 w-4 shrink-0" />
        </button>
      ))}
    </div>
  );
}
