import { useExampleSource } from "@/hooks/useExampleSource";
import type {
  AdapterId,
  ExampleLocator,
  LanguagePreference,
  PluginId,
} from "@jsoc/grid-docs";
import { useState } from "react";
import { CE_Sidebar } from "@/components/code-explorer/sidebar/CE_Sidebar";
import { CE_Body } from "@/components/code-explorer/body/CE_Body";
import { CE_Header } from "@/components/code-explorer/header/CE_Header";
import { CE_ContextProvider } from "@/components/code-explorer/CE_ContextProvider";
import { CE_SelectionContextProvider } from "@/components/code-explorer/CE_SelectionContextProvider";

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
  const [showSidebar, setShowSidebar] = useState(false);
  const [showOtherFiles, setShowOtherFiles] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const source = useExampleSource(adapterId, pluginId);

  const context = {
    adapterId,
    pluginId,
    exampleId,
    languagePreference,
    setLanguagePreference,
    showSidebar,
    setShowSidebar,
    showOtherFiles,
    setShowOtherFiles,
    showSettings,
    setShowSettings,
    source,
  };

  return (
    <CE_ContextProvider value={context}>
      <CE_SelectionContextProvider>
        <div className="bg-panel-surface border border-panel-outline flex h-full overflow-hidden rounded-md">
          <CE_Sidebar />
          <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
            <CE_Header />
            <CE_Body />
          </div>
        </div>
      </CE_SelectionContextProvider>
    </CE_ContextProvider>
  );
}
