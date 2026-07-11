import { useCodeExplorerContext } from "@/components/code-explorer/CodeExplorerContext";
import { FileIcon } from "@/components/FileIcon";

export function CE_FileInfo() {
  const { activeFile } = useCodeExplorerContext();

  if (!activeFile) return null;

  return (
    <div
      className="flex min-w-0 flex-1 items-center gap-1.5 px-2 select-none"
      title={activeFile.path}
    >
      <FileIcon
        language={activeFile.language}
        name={activeFile.name}
        size={16}
      />
      <span className="text-xs text-neutral-700 dark:text-neutral-300 truncate">
        {activeFile.name}
      </span>
    </div>
  );
}
