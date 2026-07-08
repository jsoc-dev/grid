import { useCodeExplorerContext } from "@/components/code-explorer/CE_ContextProvider";
import { CE_FileInfo } from "@/components/code-explorer/header/CE_FileInfo";
import { CE_LanguagePreference } from "@/components/code-explorer/header/CE_LanguagePreference";
import { PanelLeftOpen } from "lucide-react";

export function CE_Header() {
  const { showSidebar, setShowSidebar } = useCodeExplorerContext();

  return (
    <div className=" border-b border-panel-outline flex h-10 shrink-0 items-stretch ">
      {/* When collapsed: sidebar-styled toggle that looks like it IS the sidebar header */}
      {!showSidebar && (
        <div className="border-r border-panel-outline flex w-8 shrink-0 items-center justify-center ">
          <button
            type="button"
            onClick={() => setShowSidebar(true)}
            className="cursor-pointer rounded-md p-1 text-neutral-400 transition-colors hover:bg-neutral-200/70 hover:text-neutral-700 dark:text-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
            title="Show file explorer"
          >
            <PanelLeftOpen className="h-4 w-4" />
          </button>
        </div>
      )}
      <CE_FileInfo />
      <CE_LanguagePreference />
    </div>
  );
}
