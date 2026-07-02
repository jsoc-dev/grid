import { useCodeExplorerContext } from "@/components/code-explorer/CE_Context";
import type { SetState } from "@/types/react";
import type { LanguagePreference } from "@jsoc/grid-docs";
import { findFileByLanguagePreference } from "@jsoc/grid-docs";

const languages = [
  { id: "javascript", label: "JS" },
  { id: "typescript", label: "TS" },
] as const;

type Props = {
  show: boolean;
  showOtherFiles: boolean;
  setShowOtherFiles: SetState<boolean>;
};

export function CE_FileExplorerSettings({
  show,
  showOtherFiles,
  setShowOtherFiles,
}: Props) {
  const {
    languagePreference,
    setLanguagePreference,
    files,
    selectedFile,
    setSelectedFile,
  } = useCodeExplorerContext();

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
    <div
      className="grid transition-[grid-template-rows] duration-200 ease-out"
      style={{ gridTemplateRows: show ? "1fr" : "0fr" }}
    >
      <div className="overflow-hidden">
        <div className="z-10 flex shrink-0 flex-col gap-3 border-b border-neutral-200 bg-neutral-100 p-2 pb-3 shadow-sm dark:border-neutral-800 dark:bg-[#141414]">
          <div className="flex flex-col gap-1.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Language
            </div>
            <div className="flex items-center gap-4">
              {languages.map(({ id, label }) => (
                <label
                  key={id}
                  className="flex cursor-pointer items-center gap-1.5 text-xs text-neutral-700 dark:text-neutral-300"
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
            <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Example files
            </div>
            <label className="flex cursor-pointer items-start gap-1.5 text-xs text-neutral-700 dark:text-neutral-300 leading-tight">
              <input
                type="checkbox"
                className="mt-0.5 h-3 w-3 shrink-0 rounded text-amber-600 focus:ring-amber-500 focus:ring-offset-0"
                checked={showOtherFiles}
                onChange={(e) => setShowOtherFiles(e.target.checked)}
              />
              <span>Show other example files</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
