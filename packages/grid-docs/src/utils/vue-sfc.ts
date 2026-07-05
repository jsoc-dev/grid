import type { CodeLanguage } from "#utils/example-source-code.ts";

export type VueScript = {
  lang: CodeLanguage;
  script: string;
  startLine: number;
  endLine: number;
};

export const VUE_SCRIPT_START_REGEX = /^\s*<script(?:\s[^>]*)?>$/;
export const VUE_SCRIPT_END_REGEX = /^\s*<\/script>/;
export const VUE_SCRIPT_LANG_REGEX = /\blang="([^"]*)"/;

export function parseVueScriptLanguage(line: string): CodeLanguage {
  const langMatch = line.match(VUE_SCRIPT_LANG_REGEX);
  if (!langMatch) return "javascript"; // defaults to js if lang is missing or empty

  const lang = langMatch[1];
  if (lang === "ts" || lang === "typescript") return "typescript";
  if (lang === "tsx") return "tsx";
  if (lang === "jsx") return "jsx";
  return "javascript";
}

const extractScriptsCache = new Map<string, VueScript[]>();

export function extractScriptsFromVueSfc(code: string): VueScript[] {
  const cached = extractScriptsCache.get(code);
  if (cached) return cached;

  const scripts: VueScript[] = [];
  const lines = code.split("\n");

  let currentScriptLines: string[] | null = null;
  let currentLang: CodeLanguage | null = null;
  let startLine = -1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (currentScriptLines !== null) {
      currentScriptLines.push(line);

      if (VUE_SCRIPT_END_REGEX.test(line)) {
        scripts.push({
          lang: currentLang!,
          script: currentScriptLines.join("\n"),
          startLine,
          endLine: i,
        });
        currentScriptLines = null;
        currentLang = null;
      }
    } else if (VUE_SCRIPT_START_REGEX.test(line)) {
      currentScriptLines = [line];
      currentLang = parseVueScriptLanguage(line);
      startLine = i;
    }
  }

  extractScriptsCache.set(code, scripts);
  return scripts;
}

export function vueSfcContainsTsScript(code: string): boolean {
  return extractScriptsFromVueSfc(code).some(
    (script) => script.lang === "typescript" || script.lang === "tsx",
  );
}
