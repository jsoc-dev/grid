import { createContext, useContext } from "react";
import {
  findFileByLanguagePreference,
  findSuitableDefaultFile,
  stripExtension,
  type LanguagePreference,
} from "@jsoc/grid-docs";
import type {
  AdapterId,
  ExampleId,
  ExampleSourceFile,
  PluginId,
} from "@jsoc/grid-docs";
import type { SetState } from "@/types/react";
import type { ExampleSourceQueryResult } from "@/hooks/useExampleSource";

export type CodeExplorerContextType<
  A extends AdapterId,
  P extends PluginId<A>,
> = {
  adapterId: A;
  pluginId: P;
  exampleId: ExampleId<A, P>;
  source: ExampleSourceQueryResult;
  /**
   * The file currently being displayed.
   *
   * - The value of this property is `null` until the source query is successful.
   * - Once source query is succesful, the value would be either:
   *   - If {@link selectedFilePath} is set, then it would be that file.
   *   - Otherwise, a default file is picked from the {@link source} query result.
   */
  activeFile: ExampleSourceFile | null;
  /**
   * This holds the path of the file that user has selected from the file explorer.
   *
   * Note: This may or may not be the path of the active file that is being displayed.
   * For instance, if any option such as adapterId/pluginId/exampleId is changed, a new file having different
   * path than this might be set as activeFile depending on the new source files retrieved for the given options.
   *
   * Always use {@link activeFile} property for getting the current file.
   */
  selectedFilePath: string | null;
  languagePreference: LanguagePreference;
  showSidebar: boolean;
  setSelectedFilePath: SetState<string | null>;
  setLanguagePreference: SetState<LanguagePreference>;
  setShowSidebar: SetState<boolean>;
};

export const CodeExplorerContext = createContext<unknown>(null);

export function useCodeExplorerContext<
  A extends AdapterId = AdapterId,
  P extends PluginId<A> = PluginId<A>,
>() {
  const context = useContext(CodeExplorerContext);
  if (!context) {
    throw new Error(
      "useCodeExplorerContext must be used within a CodeExplorerProvider",
    );
  }
  return context as CodeExplorerContextType<A, P>;
}

/**
 * Resolve the active file from the source files.
 */
export function resolveActiveFile<A extends AdapterId, P extends PluginId<A>>(
  exampleId: ExampleId<A, P>,
  languagePreference: LanguagePreference,
  selectedFilePath: string | null,
  source: ExampleSourceQueryResult,
) {
  if (!source.isSuccess) return null;

  let resolved: ExampleSourceFile | undefined = undefined;

  if (selectedFilePath) {
    const selectedFile = source.files.find(
      (f) => stripExtension(f.path) === stripExtension(selectedFilePath),
    );

    if (selectedFile) {
      resolved = findFileByLanguagePreference(
        source.files,
        selectedFile,
        languagePreference,
      );
    }
  }

  resolved ??= findSuitableDefaultFile(
    source.files,
    exampleId,
    languagePreference,
  );

  return resolved;
}
