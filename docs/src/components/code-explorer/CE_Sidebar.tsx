import { FileExplorer } from "@/components/file-explorer/FileExplorer";
import { CE_SidebarCollapsed } from "@/components/code-explorer/CE_SidebarCollapsed";
import { CE_SidebarExpanded } from "@/components/code-explorer/CE_SidebarExpanded";
import { filterFilesForExample } from "@jsoc/grid-docs";
import clsx from "clsx";
import { Activity, useState } from "react";

import { useCodeExplorerContext } from "@/components/code-explorer/CE_Context";
import type { ExampleSourceFile, LanguagePreference } from "@jsoc/grid-docs";
import type { AdapterId, ExampleId, PluginId } from "@jsoc/grid-docs";

export function CE_Sidebar() {
  const {
    exampleId,
    files,
    selectedFile,
    setSelectedFile,
    languagePreference,
  } = useCodeExplorerContext();
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [showOtherFiles, setShowOtherFiles] = useState(false);

  return (
    <div
      className={clsx(
        sidebarExpanded ? "w-56" : "w-8",
        "flex shrink-0 flex-col border-r border-neutral-200 bg-neutral-100 transition-all duration-200 dark:border-neutral-800 dark:bg-[#141414]",
      )}
    >
      {sidebarExpanded ? (
        <CE_SidebarExpanded
          setSidebarExpanded={setSidebarExpanded}
          showOtherFiles={showOtherFiles}
          setShowOtherFiles={setShowOtherFiles}
        />
      ) : (
        <CE_SidebarCollapsed setSidebarExpanded={setSidebarExpanded} />
      )}

      <Activity mode={sidebarExpanded ? "visible" : "hidden"}>
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden relative">
          <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto">
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
      </Activity>
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
