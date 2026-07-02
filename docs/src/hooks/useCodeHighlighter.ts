import { useEffect, useState } from "react";
import {
  createHighlighter,
  type Highlighter,
  type BundledLanguage,
} from "shiki";
import { useTheme } from "next-themes";
import { CODE_LANGUAGES, type CodeLanguage } from "@jsoc/grid-docs";

let highlighterPromise: Promise<Highlighter> | null = null;
const githubTheme = { light: "github-light", dark: "github-dark" };
const themes = Object.values(githubTheme);
const langs = CODE_LANGUAGES.filter((lang) => lang !== "plaintext");

type CodeHighlighterLanguage = Extract<
  CodeLanguage,
  BundledLanguage | "plaintext"
>;
export function useCodeHighlighter({
  code,
  lang,
}: {
  code: string;
  lang: CodeHighlighterLanguage;
}) {
  const { resolvedTheme } = useTheme();
  const [highlightResult, setHighlightResult] = useState(() => ({
    html: getInitialCodeHtml(code),
    color: "",
    bgColor: "",
  }));

  useEffect(() => {
    let unmounted = false;

    highlighterPromise ??= createHighlighter({ themes, langs });

    highlighterPromise
      .then((highlighter) => {
        if (unmounted) return;
        const isDarkMode = resolvedTheme === "dark";
        const theme = isDarkMode ? githubTheme.dark : githubTheme.light;
        const highlighted = highlighter.codeToHtml(code, { lang, theme });

        // Extract text color
        const colorMatch = highlighted.match(/style="[^"]*color:\s*([^;"]+)/);
        const color = colorMatch ? colorMatch[1] : "";

        // Extract background color
        const bgMatch = highlighted.match(
          /style="[^"]*background-color:\s*([^;"]+)/,
        );
        const bgColor = bgMatch
          ? bgMatch[1]
          : isDarkMode
            ? "#24292e"
            : "#ffffff";

        // Extract the inner HTML of the code block
        const codeMatch = highlighted.match(/<code[^>]*>([\s\S]*?)<\/code>/);
        const innerHtml = codeMatch ? codeMatch[1] : code;

        setHighlightResult({ html: innerHtml, color, bgColor });
      })
      .catch((err) => console.error("Shiki error", err));

    return () => {
      unmounted = true;
    };
  }, [code, lang, resolvedTheme]);

  return highlightResult;
}

/**
 * Formats the raw code into a structure that matches Shiki's output before Shiki has loaded.
 * Nextra's CSS applies padding via the `.nextra-code > span` selector. If the initial HTML
 * doesn't wrap each line in a <span>, the code block will lack padding on the first render.
 */
export function getInitialCodeHtml(code: string) {
  // Escape HTML entities so they aren't parsed as real DOM nodes by dangerouslySetInnerHTML
  const escapedCode = code.replace(/[&<>"']/g, (m) =>
    m === "&"
      ? "&amp;"
      : m === "<"
        ? "&lt;"
        : m === ">"
          ? "&gt;"
          : m === '"'
            ? "&quot;"
            : "&#39;",
  );

  // Wrap each line in a span so Nextra's CSS applies correctly
  return escapedCode
    .split("\n")
    .map((line) => `<span class="line">${line}</span>`)
    .join("\n");
}
