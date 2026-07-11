import { FileExplorer } from "@/components/file-explorer/FileExplorer";
import {
  filterFilesByExampleId,
  filterFilesByLanguagePreference,
} from "@jsoc/grid-docs";

import { useCodeExplorerContext } from "@/components/code-explorer/CodeExplorerContext";
import { CE_FileExplorerMenu } from "@/components/code-explorer/sidebar-panel/CE_FileExplorerMenu";
import { useState } from "react";

export function CE_FileExplorer() {
  const [showOtherFiles, setShowOtherFiles] = useState(false);

  const {
    activeFile,
    exampleId,
    languagePreference,
    source,
    setSelectedFilePath,
  } = useCodeExplorerContext();

  if (!activeFile || !source.isSuccess) return null;

  const files = showOtherFiles
    ? source.files
    : filterFilesByExampleId(source.files, exampleId);

  const filteredFiles = filterFilesByLanguagePreference(
    files,
    languagePreference,
  );

  return (
    <div className="bg-panel-surface flex h-full w-full flex-col overflow-hidden">
      <CE_FileExplorerMenu
        showOtherFiles={showOtherFiles}
        setShowOtherFiles={setShowOtherFiles}
      />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden relative">
        <FileExplorer
          files={filteredFiles}
          onSelect={(file) => {
            setSelectedFilePath(file.path);
          }}
          defaultFile={activeFile}
        />
      </div>
    </div>
  );
}
