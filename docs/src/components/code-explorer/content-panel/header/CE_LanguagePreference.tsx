import { useCodeExplorerContext } from "@/components/code-explorer/CodeExplorerContext";
import { fileSupportsLanguagePreference } from "@jsoc/grid-docs";
import clsx from "clsx";

export function CE_LanguagePreference() {
  const { activeFile, languagePreference, setLanguagePreference, source } =
    useCodeExplorerContext();

  if (
    !activeFile ||
    !source.isSuccess ||
    !fileSupportsLanguagePreference(activeFile, source.files)
  ) {
    return null;
  }

  const buttons = [
    { lang: "javascript", label: "JS" },
    { lang: "typescript", label: "TS" },
  ] as const;

  return (
    <div className="flex shrink-0 items-center self-center mr-2 overflow-hidden rounded-md border border-neutral-200 dark:border-neutral-700">
      {buttons.map(({ lang, label }) => (
        <button
          key={lang}
          type="button"
          onClick={() => setLanguagePreference(lang)}
          className={clsx(
            "px-2 py-1 text-xs leading-none transition-colors select-none",
            languagePreference === lang
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
