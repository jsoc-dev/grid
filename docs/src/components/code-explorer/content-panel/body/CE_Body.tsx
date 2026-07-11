import { isRelevantFile, removeSnippetMarkers } from "@jsoc/grid-docs";
import { useCodeExplorerContext } from "@/components/code-explorer/CodeExplorerContext";
import { CE_CodeBlock } from "@/components/code-explorer/content-panel/body/CE_CodeBlock";
import { Info } from "lucide-react";

export function CE_Body() {
  const { activeFile, languagePreference, exampleId } =
    useCodeExplorerContext();

  if (!activeFile) return null;

  const code = activeFile.variants?.[languagePreference] ?? activeFile.code;

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
      {!isRelevantFile(activeFile, exampleId) && (
        <div className="bg-amber-50 dark:bg-amber-500/10 border-b border-amber-200 dark:border-amber-900/50 gap-2 flex items-center px-4 py-2 text-sm text-amber-800 dark:text-amber-400">
          <Info className="h-4 w-4 shrink-0" />
          <span>
            This file belongs to a different example and can be ignored.
          </span>
        </div>
      )}

      <CE_CodeBlock
        code={removeSnippetMarkers(code)}
        lang={activeFile.language}
      />
    </div>
  );
}
