import { CE_CodeBlock } from "@/components/code-explorer/CE_CodeBlock";
import { CE_FileExplorer } from "@/components/code-explorer/CE_FileExplorer";
import { CE_Header } from "@/components/code-explorer/CE_Header";
import { CodeExplorerProvider } from "@/components/code-explorer/CE_Context";
import type { ExampleSourceFile, LanguagePreference } from "@jsoc/grid-docs";
import {
  isRelevantFile,
  findSuitableDefaultFile,
  removeSnippetMarkers,
} from "@jsoc/grid-docs";
import { useExampleSource } from "@/hooks/useExampleSource";
import { type AdapterId, type ExampleId, type PluginId } from "@jsoc/grid-docs";
import { Info } from "lucide-react";
import { useState } from "react";

type CodeExplorerProps<A extends AdapterId, P extends PluginId<A>> = {
  adapterId: A;
  pluginId: P;
  exampleId: ExampleId<A, P>;
};

export function CodeExplorer<A extends AdapterId, P extends PluginId<A>>({
  adapterId,
  pluginId,
  exampleId,
}: CodeExplorerProps<A, P>) {
  const { files, isPending, error } = useExampleSource(adapterId, pluginId);

  if (isPending) return "Loading...";
  if (error) return "Failed to load files";
  if (!files?.length) return "No files found";

  return (
    <CE_View
      key={`${exampleId}.${adapterId}.${pluginId}`} // ensures remount when adapterId/pluginId/exampleId changes to ensure selected file is reset
      files={files}
      adapterId={adapterId}
      pluginId={pluginId}
      exampleId={exampleId}
    />
  );
}

type CE_ViewProps<
  A extends AdapterId,
  P extends PluginId<A>,
> = CodeExplorerProps<A, P> & {
  files: ExampleSourceFile[];
};

function CE_View<A extends AdapterId, P extends PluginId<A>>({
  files,
  adapterId,
  pluginId,
  exampleId,
}: CE_ViewProps<A, P>) {
  const [languagePreference, setLanguagePreference] =
    useState<LanguagePreference>("javascript");

  const [selectedFile, setSelectedFile] = useState(() =>
    findSuitableDefaultFile(files, exampleId, languagePreference),
  );

  const [fileExplorerExpanded, setFileExplorerExpanded] = useState(false);

  const ctx = {
    files,
    selectedFile,
    setSelectedFile,
    languagePreference,
    setLanguagePreference,
    adapterId,
    pluginId,
    exampleId,
    fileExplorerExpanded,
    setFileExplorerExpanded,
  };

  const code = selectedFile.variants?.[languagePreference] ?? selectedFile.code;

  return (
    <CodeExplorerProvider value={ctx}>
      <div className="flex h-64 overflow-hidden border border-neutral-200 dark:border-neutral-800 rounded-md">
        <CE_FileExplorer />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <CE_Header />
          {!isRelevantFile(selectedFile, exampleId) && (
            <div className="flex items-center gap-2 border-b border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-500/10 dark:text-amber-400">
              <Info className="h-4 w-4 shrink-0" />
              <span>
                This file belongs to a different example and can be ignored.
              </span>
            </div>
          )}
          <div className="min-h-0 flex-1 overflow-hidden flex flex-col">
            <CE_CodeBlock
              code={removeSnippetMarkers(code)}
              lang={selectedFile.language}
            />
          </div>
        </div>
      </div>
    </CodeExplorerProvider>
  );
}
