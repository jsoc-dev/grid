import { isRelevantFile, removeSnippetMarkers } from "@jsoc/grid-docs";
import { useCodeExplorerContext } from "@/components/code-explorer/CE_ContextProvider";
import { useCodeExplorerSelectionContext } from "@/components/code-explorer/CE_SelectionContextProvider";
import { CE_CodeBlock } from "@/components/code-explorer/body/CE_CodeBlock";
import { Info } from "lucide-react";

export function CE_Body() {
  const { source, languagePreference, exampleId } = useCodeExplorerContext();
  const selectionContext = useCodeExplorerSelectionContext();
  const { isPending, isError } = source;

  if (!selectionContext || isPending) return null;
  if (isError) return "Failed to load files";

  const { selectedFile } = selectionContext;

  const code = selectedFile.variants?.[languagePreference] ?? selectedFile.code;

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
      {!isRelevantFile(selectedFile, exampleId) && (
        <div className="bg-amber-50 dark:bg-amber-500/10 border-b border-amber-200 dark:border-amber-900/50 gap-2 flex items-center px-4 py-2 text-sm text-amber-800 dark:text-amber-400">
          <Info className="h-4 w-4 shrink-0" />
          <span>
            This file belongs to a different example and can be ignored.
          </span>
        </div>
      )}

      <CE_CodeBlock
        code={removeSnippetMarkers(code)}
        lang={selectedFile.language}
      />
    </div>
  );
}
