"use client";

import { createHighlighter, type Highlighter } from "shiki";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Pre } from "nextra/components";

let highlighterPromise: Promise<Highlighter> | null = null;

export function CodeBlock({
  code = "",
  language,
  showCopyCode = true,
  className,
}: {
  code: string;
  language: string;
  showCopyCode?: boolean;
  className?: string;
}) {
  const { resolvedTheme } = useTheme();
  const [highlightResult, setHighlightResult] = useState(() => ({
    html: getInitialCodeHtml(code),
    color: "",
  }));

  useEffect(() => {
    let unmounted = false;

    highlighterPromise ??= createHighlighter({
      themes: ["github-dark", "github-light"],
      langs: [
        "typescript",
        "javascript",
        "tsx",
        "jsx",
        "html",
        "css",
        "json",
        "vue",
      ],
    });

    highlighterPromise
      .then((highlighter) => {
        if (unmounted) return;

        const highlighted = highlighter.codeToHtml(code, {
          lang: language,
          theme: resolvedTheme === "dark" ? "github-dark" : "github-light",
        });

        // Nextra's Pre component does not style the outer <pre> with a base text color,
        // and instead relies on the body/theme default. Shiki sets the theme's base
        // text color on the <pre style="color: ..."> tag it generates.
        // We extract it here so we can apply it directly to the <code> wrapper.
        const colorMatch = highlighted.match(/style="[^"]*color:\s*([^;"]+)/);
        const color = colorMatch ? colorMatch[1] : "";

        // Shiki outputs `<pre><code>...</code></pre>`.
        // If we inject that directly into Nextra's <Pre> component, we get invalid HTML
        // (a <pre> inside a <pre>), which breaks Nextra's padding and layout CSS.
        // Instead, we extract only the inner HTML of the <code> block.
        const codeMatch = highlighted.match(/<code[^>]*>([\s\S]*?)<\/code>/);
        const innerHtml = codeMatch ? codeMatch[1] : code;

        setHighlightResult({ html: innerHtml, color });
      })
      .catch((err) => console.error("Shiki error", err));

    return () => {
      unmounted = true;
    };
  }, [code, language, resolvedTheme]);

  return (
    <Pre
      className={className}
      data-language={language}
      data-copy={showCopyCode ? "" : undefined}
      data-word-wrap=""
    >
      <code
        // "nextra-code" hooks into Nextra's CSS for copy buttons and styling.
        // Important: Nextra applies `display: grid` to this <code> element.
        // In a CSS grid, whitespace-only text nodes (like \n) are discarded by the browser.
        // Because Shiki outputs lines as inline <span> elements, an empty line becomes an empty span with 0 height.
        // Without the \n to force a line break, empty lines completely disappear in the grid!
        // To fix this, "[&>.line]:block" and "[&>.line]:min-h-4" force these empty spans to have a physical height of 1rem.
        className="nextra-code [&>.line]:block [&>.line]:min-h-4"
        dir="ltr"
        style={{ color: highlightResult.color || undefined }}
        dangerouslySetInnerHTML={{ __html: highlightResult.html }}
      />
    </Pre>
  );
}

/**
 * Formats the raw code into a structure that matches Shiki's output before Shiki has loaded.
 * Nextra's CSS applies padding via the `.nextra-code > span` selector. If the initial HTML
 * doesn't wrap each line in a <span>, the code block will lack padding on the first render.
 */
function getInitialCodeHtml(code: string) {
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
