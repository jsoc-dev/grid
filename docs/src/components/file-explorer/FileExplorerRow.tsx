import type { ItemInstance } from "@headless-tree/core";
import { FileIcon } from "@/components/FileIcon";
import clsx from "clsx";
import { ChevronRight } from "lucide-react";
import type { FileExplorerItem } from "@/components/file-explorer/FileExplorer";
import type { ExampleSourceFile } from "@/types/code-explorer";

type Props = {
  item: ItemInstance<FileExplorerItem>;
  onSelectFile: (file: ExampleSourceFile) => void;
};

/**
 * A single row in the file explorer tree, rendering a file or folder entry.
 */
export function FileExplorerRow({ item, onSelectFile }: Props) {
  const itemData = item.getItemData();
  const isFolder = item.isFolder();
  const isExpanded = item.isExpanded();
  const isSelected = item.isSelected();
  const itemProps = item.getProps();

  return (
    <button
      {...itemProps}
      title={item.getId()}
      type="button"
      onClick={(event) => {
        itemProps.onClick?.(event);

        if (!isFolder && itemData.file) {
          onSelectFile(itemData.file);
        }
      }}
      className={clsx(
        "flex cursor-pointer w-full items-center gap-1.5 rounded-md px-2 py-1 text-left text-[13px] transition-colors",
        isSelected
          ? "bg-neutral-200 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100"
          : "text-neutral-600 hover:bg-neutral-200/70 dark:text-neutral-400 dark:hover:bg-neutral-800/60",
      )}
      style={{ paddingLeft: `${item.getItemMeta().level * 12 + 8}px` }}
    >
      {isFolder ? (
        <ChevronRight
          className={clsx("h-4 w-4 shrink-0 transition-transform", {
            "rotate-90": isExpanded,
          })}
        />
      ) : (
        <span className="h-4 w-4 shrink-0" aria-hidden="true" />
      )}

      <FileIcon
        language={itemData.file?.language}
        name={item.getItemName()}
        isFolder={isFolder}
        expanded={isExpanded}
      />

      <span className="min-w-0 truncate">{item.getItemName()}</span>
    </button>
  );
}
