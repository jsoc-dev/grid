import { FileExplorer } from "@/components/file-explorer/FileExplorer";
import { filterFilesForExample } from "@jsoc/grid-docs";

import { useCodeExplorerContext } from "@/components/code-explorer/CE_ContextProvider";
import type { ExampleSourceFile, LanguagePreference } from "@jsoc/grid-docs";
import type { AdapterId, ExampleId, PluginId } from "@jsoc/grid-docs";
import { useCodeExplorerSelectionContext } from "@/components/code-explorer/CE_SelectionContextProvider";

export function CE_FileExplorer() {
  const { exampleId, languagePreference, showOtherFiles } =
    useCodeExplorerContext();

  const selectionContext = useCodeExplorerSelectionContext();

  if (!selectionContext) return null;

  const { files, selectedFile, setSelectedFile } = selectionContext;

  const filteredFiles = filterFiles(
    files,
    languagePreference,
    showOtherFiles,
    exampleId,
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden relative">
      <FileExplorer
        files={filteredFiles}
        onSelect={setSelectedFile}
        defaultFile={selectedFile}
      />
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
