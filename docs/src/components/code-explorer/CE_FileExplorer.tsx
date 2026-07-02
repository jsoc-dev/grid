import { FileExplorer } from "@/components/file-explorer/FileExplorer";
import { CE_FileExplorerSettings } from "@/components/code-explorer/CE_FileExplorerSettings";
import { filterFilesForExample } from "@jsoc/grid-docs";
import clsx from "clsx";
import { PanelLeftClose, Settings } from "lucide-react";
import { useState } from "react";

import { useCodeExplorerContext } from "@/components/code-explorer/CE_Context";
import type { ExampleSourceFile, LanguagePreference } from "@jsoc/grid-docs";
import type { AdapterId, ExampleId, PluginId } from "@jsoc/grid-docs";

export function CE_FileExplorer() {
  const {
    exampleId,
    files,
    selectedFile,
    setSelectedFile,
    languagePreference,
    fileExplorerExpanded,
    setFileExplorerExpanded,
  } = useCodeExplorerContext();
  const [showOtherFiles, setShowOtherFiles] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div
      className={clsx(
        "group flex shrink-0 flex-col border-r border-neutral-200 bg-neutral-100 transition-[width] duration-200 dark:border-neutral-800 dark:bg-[#141414]",
        fileExplorerExpanded ? "w-56" : "w-0 overflow-hidden border-r-0",
      )}
    >
      {/* Header toolbar */}
      <div className="flex h-8 shrink-0 items-center justify-between border-b border-neutral-200 px-2 dark:border-neutral-800">
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

          <button
            type="button"
            onClick={() => setFileExplorerExpanded(false)}
            className="cursor-pointer rounded-md p-1 text-neutral-400 transition-colors hover:bg-neutral-200/70 hover:text-neutral-700 dark:text-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
            title="Hide file explorer"
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Settings panel */}
      <CE_FileExplorerSettings
        show={showSettings}
        showOtherFiles={showOtherFiles}
        setShowOtherFiles={setShowOtherFiles}
      />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden relative">
        <FileExplorer
          files={filterFiles(
            files,
            languagePreference,
            showOtherFiles,
            exampleId,
          )}
          onSelect={setSelectedFile}
          defaultFile={selectedFile}
        />
      </div>
    </div>
  );
}

function filterFiles<A extends AdapterId, P extends PluginId<A>>(
  files: ExampleSourceFile[],
  languagePreference: LanguagePreference,
  showOtherFiles: boolean,
  exampleId: ExampleId<A, P>,
) {
  let filteredFiles = files;

  if (!showOtherFiles) {
    filteredFiles = filterFilesForExample(files, exampleId);
  }

  filteredFiles = filteredFiles.filter((f) => {
    // In our metadata, we properly identify .tsx and .jsx files as "tsx" and "jsx" languages.
    // However, the language toggle in the UI only switches between "typescript" and "javascript".
    // We map the framework-specific extensions back to their base language here so the filter works.
    const isTSFile = ["typescript", "tsx"].includes(f.language);
    const isJSFile = ["javascript", "jsx"].includes(f.language);

    if (isTSFile) return languagePreference === "typescript";
    if (isJSFile) return languagePreference === "javascript";

    return true;
  });

  return filteredFiles;
}
