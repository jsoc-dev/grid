import { useEffect, useRef } from "react";
import { Panel, type PanelImperativeHandle } from "react-resizable-panels";
import { useCodeExplorerContext } from "@/components/code-explorer/CodeExplorerContext";
import { CE_FileExplorer } from "@/components/code-explorer/sidebar-panel/CE_FileExplorer";

export type SidebarView = "explorer";

export function CE_SidebarPanel() {
  const { activeView, showSidebar, setShowSidebar } = useCodeExplorerContext();
  const sidebarPanelRef = useRef<PanelImperativeHandle | null>(null);
  const showSidebarCountRef = useRef(0);

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

  return (
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
      <div className="border-r border-panel-outline h-full">
        {activeView === "explorer" && <CE_FileExplorer />}
      </div>
    </Panel>
  );
}
