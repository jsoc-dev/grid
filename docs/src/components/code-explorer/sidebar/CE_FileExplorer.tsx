import { FileExplorer } from "@/components/file-explorer/FileExplorer";
import {
  filterFilesByExampleId,
  filterFilesByLanguagePreference,
} from "@jsoc/grid-docs";

import { useCodeExplorerContext } from "@/components/code-explorer/CodeExplorerContext";

type Props = {
  showOtherFiles: boolean;
};

export function CE_FileExplorer({ showOtherFiles }: Props) {
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
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden relative">
      <FileExplorer
        files={filteredFiles}
        onSelect={(file) => {
          setSelectedFilePath(file.path);
        }}
        defaultFile={activeFile}
      />
    </div>
  );
}
