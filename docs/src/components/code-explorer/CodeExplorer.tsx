import { CE_ActivityBar } from "@/components/code-explorer/activity-bar/CE_ActivityBar";
import { CodeExplorerContext } from "@/components/code-explorer/CodeExplorerContext";
import { CE_ContentPanel } from "@/components/code-explorer/content-panel/CE_ContentPanel";
import {
  CE_SidebarPanel,
  type SidebarView,
} from "@/components/code-explorer/sidebar-panel/CE_SidebarPanel";
import {
  useExampleSource,
  type ExampleSourceQueryResult,
} from "@/hooks/useExampleSource";
import {
  findFileByLanguagePreference,
  findSuitableDefaultFile,
  stripExtension,
  type AdapterId,
  type ExampleId,
  type ExampleLocator,
  type ExampleSourceFile,
  type LanguagePreference,
  type PluginId,
} from "@jsoc/grid-docs";
import { useState, useMemo } from "react";
import { Group } from "react-resizable-panels";

export type CodeExplorerProps<
  A extends AdapterId,
  P extends PluginId<A>,
> = ExampleLocator<A, P>;

export function CodeExplorer<A extends AdapterId, P extends PluginId<A>>({
  adapterId,
  pluginId,
  exampleId,
}: CodeExplorerProps<A, P>) {
  const [languagePreference, setLanguagePreference] =
    useState<LanguagePreference>("javascript");
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeView, setActiveView] = useState<SidebarView>("explorer");

  const source = useExampleSource(adapterId, pluginId);

  const activeFile = useMemo(
    () =>
      resolveActiveFile(
        exampleId,
        languagePreference,
        selectedFilePath,
        source,
      ),
    [source, selectedFilePath, exampleId, languagePreference],
  );

  const context = {
    adapterId,
    pluginId,
    exampleId,
    source,
    activeFile,
    activeView,
    setActiveView,
    selectedFilePath,
    languagePreference,
    showSidebar,
    setSelectedFilePath,
    setLanguagePreference,
    setShowSidebar,
  };

  return (
    <CodeExplorerContext.Provider value={context}>
      <div className="bg-panel-surface border border-panel-outline flex h-full overflow-hidden rounded-md">
        <CE_ActivityBar />
        <Group className="flex flex-1" orientation="horizontal">
          <CE_SidebarPanel />
          <CE_ContentPanel />
        </Group>
      </div>
    </CodeExplorerContext.Provider>
  );
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
