import { useCodeExplorerContext } from "@/components/code-explorer/CodeExplorerContext";
import type { SidebarView } from "@/components/code-explorer/sidebar-panel/CE_SidebarPanel";
import clsx from "clsx";

export type ActivityBarButtonProps = {
  id?: SidebarView;
  title: string;
  Icon: React.ElementType;
  onClick: () => void;
};

export function ActivityBarButton({
  id,
  title,
  Icon,
  onClick,
}: ActivityBarButtonProps) {
  const { activeView, showSidebar } = useCodeExplorerContext();

  return (
    <button
      className={clsx(
        "p-1.5 rounded-md transition-colors cursor-pointer",
        activeView === id && showSidebar
          ? "bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
          : "hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300",
      )}
      title={title}
      onClick={onClick}
    >
      <Icon className="w-5 h-5" />
    </button>
  );
}
