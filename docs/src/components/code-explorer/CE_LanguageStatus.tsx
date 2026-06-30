import { findFileByLanguagePreference } from "@jsoc/grid-docs";
import { FileIcon } from "@/components/FileIcon";
import { useCodeExplorerContext } from "@/components/code-explorer/CE_Context";
import { toPascalCase } from "@jsoc/utils";
import clsx from "clsx";

export function CE_LanguageStatus() {
  const {
    files,
    selectedFile,
    setSelectedFile,
    languagePreference,
    setLanguagePreference,
  } = useCodeExplorerContext();

  const isJsOrTsFile = ["typescript", "javascript", "tsx", "jsx"].includes(
    selectedFile.language,
  );

  if (isJsOrTsFile) {
    const jsFile = findFileByLanguagePreference(
      files,
      selectedFile,
      "javascript",
    );
    const tsFile = findFileByLanguagePreference(
      files,
      selectedFile,
      "typescript",
    );

    if (jsFile && tsFile) {
      const languages = [
        { lang: "javascript", file: jsFile },
        { lang: "typescript", file: tsFile },
      ] as const;

      return (
        <Wrapper>
          <div className="flex w-full flex-col">
            {languages.map(({ lang, file }) => {
              const isSelected = languagePreference === lang;
              const langLabel = toPascalCase(lang);
              const title = isSelected ? langLabel : `Switch to ${langLabel}`;

              return (
                <button
                  key={lang}
                  type="button"
                  title={title}
                  onClick={() => {
                    setLanguagePreference(lang);
                    setSelectedFile(file);
                  }}
                  className={clsx(
                    "flex w-full items-center justify-center p-2 transition-all",
                    isSelected
                      ? "cursor-default bg-white dark:bg-neutral-800"
                      : "cursor-pointer opacity-70 grayscale hover:opacity-100 hover:grayscale-0 dark:opacity-40",
                  )}
                >
                  <FileIcon language={lang} />
                </button>
              );
            })}
          </div>
        </Wrapper>
      );
    }
  }

  return (
    <Wrapper>
      <div className="flex w-full justify-center pb-4">
        <FileIcon language={selectedFile.language} name={selectedFile.name} />
      </div>
    </Wrapper>
  );
}

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 w-full flex-col justify-end">{children}</div>
  );
}
