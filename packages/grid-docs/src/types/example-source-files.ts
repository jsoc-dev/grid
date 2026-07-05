import type { CodeLanguage } from "#utils/example-source-code.ts";

/**
 * Map of source code from a file to some other language(s) of same domain.
 * Examples:
 * 1. TS source file can have JS variant.
 * 2. CSS source file can have SCSS/Tailwind variant
 */
export type SourceCodeVariants<C extends CodeLanguage = CodeLanguage> = Omit<
  Partial<{ [K in CodeLanguage]: string }>,
  [CodeLanguage] extends [C] ? never : C
>;

/**
 * A source code file from an example app
 */
export type ExampleSourceFile<C extends CodeLanguage = CodeLanguage> = {
  path: string;
  code: string;
  name: string;
  language: C;
  variants?: SourceCodeVariants<C>;
};

export type LanguagePreference = "javascript" | "typescript";
