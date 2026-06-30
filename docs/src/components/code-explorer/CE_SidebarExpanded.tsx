import { useCodeExplorerContext } from "@/components/code-explorer/CE_Context";
import type { SetState } from "@/types/react";
import type { LanguagePreference } from "@jsoc/grid-docs";
import { findFileByLanguagePreference } from "@jsoc/grid-docs";
import clsx from "clsx";
import { Settings, PanelLeftClose } from "lucide-react";
import { useState } from "react";

type Props = {
  setSidebarExpanded: SetState<boolean>;
  showOtherFiles: boolean;
  setShowOtherFiles: SetState<boolean>;
};

export function CE_SidebarExpanded({
  setSidebarExpanded,
  showOtherFiles,
  setShowOtherFiles,
}: Props) {
  const [showSettings, setShowSettings] = useState(false);
  const {
    languagePreference,
    setLanguagePreference,
    files,
    selectedFile,
    setSelectedFile,
  } = useCodeExplorerContext();

  const languages = [
    { id: "javascript", label: "JS" },
    { id: "typescript", label: "TS" },
  ] as const;

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
    <>
      <div className="flex h-8 items-center justify-between border-b border-neutral-200 px-2 dark:border-neutral-800">
        <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
          Files
        </span>

        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={() => setShowSettings((v) => !v)}
            className={clsx(
              "cursor-pointer rounded-md p-1 transition-colors",
              showSettings
                ? "bg-neutral-200 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100"
                : "text-neutral-400 hover:bg-neutral-200/70 hover:text-neutral-700 dark:text-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-neutral-300",
            )}
            title={`${showSettings ? "Hide" : "Show"} settings`}
          >
            <Settings className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => setSidebarExpanded(false)}
            className="cursor-pointer rounded-md p-1 text-neutral-400 transition-colors hover:bg-neutral-200/70 hover:text-neutral-700 dark:text-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
            title="Hide file explorer"
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>
        </div>
      </div>

      {showSettings && (
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
      )}
    </>
  );
}
