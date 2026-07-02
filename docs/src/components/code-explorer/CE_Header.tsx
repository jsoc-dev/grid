import { useCodeExplorerContext } from "@/components/code-explorer/CE_Context";
import { CE_LanguagePreference } from "@/components/code-explorer/CE_LanguagePreference";
import { FileIcon } from "@/components/FileIcon";
import { PanelLeftOpen } from "lucide-react";

export function CE_Header() {
  const { selectedFile, fileExplorerExpanded, setFileExplorerExpanded } =
    useCodeExplorerContext();

  return (
    <div className="flex h-8 shrink-0 items-stretch border-b border-neutral-200 dark:border-neutral-800">
      {/* When collapsed: sidebar-styled toggle that looks like it IS the sidebar header */}
      {!fileExplorerExpanded && (
        <div className="flex w-8 shrink-0 items-center justify-center border-r border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-[#141414]">
          <button
            type="button"
            onClick={() => setFileExplorerExpanded(true)}
            className="cursor-pointer rounded-md p-1 text-neutral-400 transition-colors hover:bg-neutral-200/70 hover:text-neutral-700 dark:text-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
            title="Show file explorer"
          >
            <PanelLeftOpen className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* File icon + name */}
      <div
        className="flex min-w-0 flex-1 items-center gap-1.5 px-2 select-none"
        title={selectedFile.path}
      >
        <FileIcon language={selectedFile.language} name={selectedFile.name} />
        <span className="truncate text-xs text-neutral-700 dark:text-neutral-300">
          {selectedFile.name}
        </span>
      </div>

      {/* Language toggle */}
      <CE_LanguagePreference />
    </div>
  );
}
