import { PanelLeftOpen } from "lucide-react";
import { CE_LanguageStatus } from "@/components/code-explorer/CE_LanguageStatus";
import type { SetState } from "@/types/react";

type Props = {
  setSidebarExpanded: SetState<boolean>;
};

export function CE_SidebarCollapsed({ setSidebarExpanded }: Props) {
  return (
    <>
      <div className="flex h-8 items-center justify-center border-b border-neutral-200 dark:border-neutral-800">
        <button
          type="button"
          onClick={() => setSidebarExpanded(true)}
          className="cursor-pointer rounded-md p-1 text-neutral-400 transition-colors hover:bg-neutral-200/70 hover:text-neutral-700 dark:text-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
          title="Show file explorer"
        >
          <PanelLeftOpen className="h-4 w-4" />
        </button>
      </div>

      <CE_LanguageStatus />
    </>
  );
}
