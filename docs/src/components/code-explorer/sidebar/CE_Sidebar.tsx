import { useCodeExplorerContext } from "@/components/code-explorer/CE_ContextProvider";
import { CE_FileExplorer } from "@/components/code-explorer/sidebar/CE_FileExplorer";
import { CE_FileExplorerSettings } from "@/components/code-explorer/sidebar/CE_FileExplorerSettings";
import clsx from "clsx";
import { PanelLeftClose, Settings } from "lucide-react";

export function CE_Sidebar() {
  const { showSidebar, setShowSidebar, showSettings, setShowSettings } =
    useCodeExplorerContext();

  return (
    <div className="bg-panel-surface flex h-full w-full flex-col overflow-hidden">
      {/* Header toolbar */}
      <div className="border-b border-panel-outline flex h-10 shrink-0 items-center justify-between px-2">
        <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 select-none">
          Files
        </span>

        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={() => setShowSettings((v) => !v)}
            className={clsx(
              "cursor-pointer rounded-md p-1 transition-colors",
              showSettings
                ? "bg-neutral-200 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100"
                : "text-neutral-400 hover:bg-neutral-200/70 hover:text-neutral-700 dark:text-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-neutral-300",
            )}
            title={`${showSettings ? "Hide" : "Show"} settings`}
          >
            <Settings className="h-4 w-4" />
          </button>

          {showSidebar && (
            <button
              type="button"
              onClick={() => setShowSidebar(false)}
              className="cursor-pointer rounded-md p-1 text-neutral-400 transition-colors hover:bg-neutral-200/70 hover:text-neutral-700 dark:text-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
              title="Hide file explorer"
            >
              <PanelLeftClose className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Settings panel */}
      <div
        className="grid transition-[grid-template-rows] duration-200 ease-out"
        style={{ gridTemplateRows: showSettings ? "1fr" : "0fr" }}
      >
        <CE_FileExplorerSettings />
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden relative">
        <CE_FileExplorer />
      </div>
    </div>
  );
}
