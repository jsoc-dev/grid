import type { ExamplePreviewRendererParams } from "@/components/ExamplePreview";
import clsx from "clsx";
import { Code2, ExternalLink, RotateCcw } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

export function ExampleControls({
  showCode,
  setShowCode,
  rendererParams,
}: {
  showCode: boolean;
  setShowCode: Dispatch<SetStateAction<boolean>>;
  rendererParams: ExamplePreviewRendererParams;
}) {
  const { isPending } = rendererParams;
  const disableButtons = !!(isPending || rendererParams.error);
  const reload = disableButtons ? undefined : rendererParams.reload;
  const openInNewTab = disableButtons ? undefined : rendererParams.openInNewTab;

  const buttons = [
    {
      action: () => setShowCode(!showCode),
      label: showCode ? "Hide code" : "Show code",
      Icon: Code2,
      active: showCode,
    },
    {
      action: reload,
      label: "Reload",
      Icon: RotateCcw,
      disabled: disableButtons,
    },
    {
      action: openInNewTab,
      label: "Open in new tab",
      Icon: ExternalLink,
      disabled: disableButtons,
    },
  ];

  return (
    <div className="flex justify-end ">
      {buttons.map((button, index) => (
        <button
          key={index}
          type="button"
          onClick={button.action}
          disabled={button.disabled}
          aria-label={button.label}
          title={button.label}
          className={clsx(
            "flex items-center justify-center transition-colors",
            index === 0
              ? "h-8 gap-2 rounded-lg border px-3 mr-2 text-sm font-medium"
              : "h-8 w-8 rounded-lg",
            button.active
              ? index === 0
                ? "border-zinc-300 bg-zinc-100 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                : "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
              : index === 0
                ? "border-zinc-200 text-zinc-600 dark:border-zinc-800 dark:text-zinc-400"
                : "text-zinc-500 dark:text-zinc-400",
            button.disabled
              ? "cursor-not-allowed opacity-50"
              : "cursor-pointer hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100",
          )}
        >
          <button.Icon className="h-4 w-4 shrink-0" />
          {index === 0 && <span>Code</span>}
        </button>
      ))}
    </div>
  );
}
