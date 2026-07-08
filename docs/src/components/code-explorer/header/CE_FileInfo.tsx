import { useCodeExplorerSelectionContext } from "@/components/code-explorer/CE_SelectionContextProvider";
import { FileIcon } from "@/components/FileIcon";

export function CE_FileInfo() {
  const selectionContext = useCodeExplorerSelectionContext();

  if (!selectionContext) return null;

  const { selectedFile } = selectionContext;

  return (
    <div
      className="flex min-w-0 flex-1 items-center gap-1.5 px-2 select-none"
      title={selectedFile.path}
    >
      <FileIcon
        language={selectedFile.language}
        name={selectedFile.name}
        size={16}
      />
      <span className="text-sm text-neutral-700 dark:text-neutral-300 truncate">
        {selectedFile.name}
      </span>
    </div>
  );
}
