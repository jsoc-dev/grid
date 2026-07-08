import { useCodeExplorerContext } from "@/components/code-explorer/CE_ContextProvider";
import { useCodeExplorerSelectionContext } from "@/components/code-explorer/CE_SelectionContextProvider";
import { findFileByLanguagePreference } from "@jsoc/grid-docs";
import type { LanguagePreference } from "@jsoc/grid-docs";
import clsx from "clsx";

export function CE_LanguagePreference() {
  const selectionContext = useCodeExplorerSelectionContext();
  const { languagePreference, setLanguagePreference } =
    useCodeExplorerContext();

  if (!selectionContext) return null;

  const { files, selectedFile, setSelectedFile } = selectionContext;

  const fileSupportsJsTs = [
    "typescript",
    "javascript",
    "tsx",
    "jsx",
    "vue",
  ].includes(selectedFile.language);

  const jsFile = fileSupportsJsTs
    ? findFileByLanguagePreference(files, selectedFile, "javascript")
    : null;
  const tsFile = fileSupportsJsTs
    ? findFileByLanguagePreference(files, selectedFile, "typescript")
    : null;

  if (!jsFile || !tsFile) return null;

  const languages = [
    { lang: "javascript", label: "JS", file: jsFile },
    { lang: "typescript", label: "TS", file: tsFile },
  ] as const;

  const handleLanguageChange = (lang: LanguagePreference) => {
    const target = lang === "javascript" ? jsFile : tsFile;
    setLanguagePreference(lang);
    if (target) setSelectedFile(target);
  };

  const isPreferredLanguage = (lang: LanguagePreference) =>
    languagePreference === lang;

  return (
    <div className="flex shrink-0 items-center self-center mr-2 overflow-hidden rounded-md border border-neutral-200 dark:border-neutral-700">
      {languages.map(({ lang, label }) => (
        <button
          key={lang}
          type="button"
          onClick={() => handleLanguageChange(lang)}
          className={clsx(
            "px-2 py-1 text-xs leading-none transition-colors select-none",
            isPreferredLanguage(lang)
              ? "bg-neutral-200 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-100"
              : "cursor-pointer text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 dark:text-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-neutral-300",
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
