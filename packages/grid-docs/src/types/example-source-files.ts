import type { CodeLanguage } from "#utils/example-source-code.ts";

export type ExampleSourceFile = {
  path: string;
  code: string;
  name: string;
  language: CodeLanguage;
};

export type LanguagePreference = "javascript" | "typescript";
