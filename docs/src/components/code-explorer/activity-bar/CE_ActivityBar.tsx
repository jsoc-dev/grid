import type { SidebarView } from "@/components/code-explorer/sidebar-panel/CE_SidebarPanel";
import { useCodeExplorerContext } from "@/components/code-explorer/CodeExplorerContext";
import { ActivityBarButton } from "@/components/code-explorer/activity-bar/CE_ActivityBarButton";
import { Files } from "lucide-react";
import { GitHubIcon } from "nextra/icons";
import { getExampleAppGitHubUrl } from "@jsoc/grid-docs";
import { openLinkInNewTab } from "@/utils/window";

export function CE_ActivityBar() {
  const {
    adapterId,
    pluginId,
    activeView,
    setActiveView,
    showSidebar,
    setShowSidebar,
  } = useCodeExplorerContext();

  const githubUrl = getExampleAppGitHubUrl(adapterId, pluginId);

  const changeActiveView = (view: SidebarView) => {
    if (showSidebar && activeView === view) {
      setShowSidebar(false);
    } else {
      setActiveView(view);
      setShowSidebar(true);
    }
  };

  return (
    <div className="flex w-11 flex-col items-center border-r border-panel-outline py-2 shrink-0 bg-neutral-50 dark:bg-neutral-900 justify-between">
      {/* top items */}
      <div className="flex flex-col gap-2">
        <ActivityBarButton
          id="explorer"
          title="File Explorer"
          Icon={Files}
          onClick={() => changeActiveView("explorer")}
        />
      </div>

      {/* bottom items */}
      <div className="flex flex-col gap-2">
        <ActivityBarButton
          title="GitHub"
          Icon={GitHubIcon}
          onClick={() => openLinkInNewTab(githubUrl)}
        />
      </div>
    </div>
  );
}
