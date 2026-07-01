import type { CodeLanguage } from "@/utils/source-code";

export type ExampleSourceFile = {
  path: string;
  code: string;
  name: string;
  language: CodeLanguage;
};

export type LanguagePreference = "javascript" | "typescript";
