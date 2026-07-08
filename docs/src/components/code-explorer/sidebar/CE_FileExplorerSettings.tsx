import { useCodeExplorerContext } from "@/components/code-explorer/CE_ContextProvider";
import { useCodeExplorerSelectionContext } from "@/components/code-explorer/CE_SelectionContextProvider";
import type { LanguagePreference } from "@jsoc/grid-docs";
import { findFileByLanguagePreference } from "@jsoc/grid-docs";

const languages = [
  { id: "javascript", label: "JS" },
  { id: "typescript", label: "TS" },
] as const;

export function CE_FileExplorerSettings() {
  const {
    languagePreference,
    setLanguagePreference,
    showOtherFiles,
    setShowOtherFiles,
  } = useCodeExplorerContext();
  const selectionContext = useCodeExplorerSelectionContext();

  if (!selectionContext) return null;

  const { files, selectedFile, setSelectedFile } = selectionContext;

  const handleLanguageChange = (newLanguage: LanguagePreference) => {
    setLanguagePreference(newLanguage);
    const newFile = findFileByLanguagePreference(
      files,
      selectedFile,
      newLanguage,
    );

    if (newFile) {
      setSelectedFile(newFile);
    }
  };

  return (
    <div className="overflow-hidden">
      <div className="border-b border-panel-outline bg-panel-surface z-10 flex shrink-0 flex-col gap-3 p-2 pb-3 shadow-sm">
        <div className="flex flex-col gap-1.5">
          <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 select-none truncate">
            Language
          </div>
          <div className="flex items-center gap-4">
            {languages.map(({ id, label }) => (
              <label
                key={id}
                className="flex cursor-pointer items-center gap-1.5 text-xs text-neutral-700 dark:text-neutral-300 select-none"
              >
                <input
                  type="radio"
                  className="h-3 w-3 text-amber-600 focus:ring-amber-500 focus:ring-offset-0"
                  checked={languagePreference === id}
                  onChange={() => handleLanguageChange(id)}
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 select-none truncate">
            Example files
          </div>
          <label className="flex cursor-pointer items-start gap-1.5 text-xs text-neutral-700 dark:text-neutral-300 leading-tight select-none">
            <input
              type="checkbox"
              className="mt-0.5 h-3 w-3 shrink-0 rounded text-amber-600 focus:ring-amber-500 focus:ring-offset-0"
              checked={showOtherFiles}
              onChange={(e) => setShowOtherFiles(e.target.checked)}
            />
            <span className="truncate">Show other example files</span>
          </label>
        </div>
      </div>
    </div>
  );
}
