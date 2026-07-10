import { useExampleSource } from "@/hooks/useExampleSource";
import {
  type AdapterId,
  type ExampleLocator,
  type LanguagePreference,
  type PluginId,
} from "@jsoc/grid-docs";
import { useState, useRef, useEffect, useMemo } from "react";
import { CE_Sidebar } from "@/components/code-explorer/sidebar/CE_Sidebar";
import { CE_Body } from "@/components/code-explorer/body/CE_Body";
import { CE_Header } from "@/components/code-explorer/header/CE_Header";
import {
  CodeExplorerContext,
  resolveActiveFile,
} from "@/components/code-explorer/CodeExplorerContext";
import {
  Panel,
  Group,
  Separator,
  type PanelImperativeHandle,
} from "react-resizable-panels";
import clsx from "clsx";

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

  const sidebarPanelRef = useRef<PanelImperativeHandle | null>(null);
  const showSidebarCountRef = useRef(0);

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

  useEffect(() => {
    const sidebarPanel = sidebarPanelRef.current;
    if (!sidebarPanel) return;

    if (showSidebar) {
      if (++showSidebarCountRef.current === 1) {
        // On the first expansion, calling `expand()` restores to the defaultSize (0),
        // which falls back to minSize. Since minSize is too narrow for the sidebar,
        // we explicitly set a wider initial size using `resize()` instead.
        sidebarPanel.resize(224);
      } else {
        sidebarPanel.expand();
      }
    } else {
      sidebarPanel.collapse();
    }
  }, [showSidebar]);

  const context = {
    adapterId,
    pluginId,
    exampleId,
    source,
    activeFile,
    selectedFilePath,
    languagePreference,
    showSidebar,
    setSelectedFilePath,
    setLanguagePreference,
    setShowSidebar,
  };

  return (
    <CodeExplorerContext.Provider value={context}>
      <Group
        className="bg-panel-surface border border-panel-outline flex h-full overflow-hidden rounded-md"
        orientation="horizontal"
      >
        <Panel
          id="sidebar"
          panelRef={sidebarPanelRef}
          collapsible
          defaultSize={0}
          minSize={160}
          maxSize={400}
          onResize={(size) => {
            setShowSidebar(size.inPixels > 0);
          }}
        >
          <CE_Sidebar />
        </Panel>

        <Separator
          className={clsx(
            "w-2.75 -mx-1.25 cursor-col-resize relative select-none outline-none z-10",
            "after:absolute after:inset-y-0 after:left-1/2 after:-translate-x-1/2",
            "after:w-px after:transition-all",
            showSidebar ? "after:bg-panel-outline" : "after:bg-transparent",
            "hover:after:w-0.75 hover:after:bg-blue-500",
          )}
        />

        <Panel id="content">
          <div className="flex min-w-0 flex-1 flex-col overflow-hidden h-full">
            <CE_Header />
            <CE_Body />
          </div>
        </Panel>
      </Group>
    </CodeExplorerContext.Provider>
  );
}
