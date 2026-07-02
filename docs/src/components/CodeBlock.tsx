"use client";

import { useCodeHighlighter } from "@/hooks/useCodeHighlighter";
import type { CodeLanguage } from "@jsoc/grid-docs";
import { Pre } from "nextra/components";

export function CodeBlock({
  code = "",
  lang,
  showCopyCode = true,
  className,
}: {
  code: string;
  lang: CodeLanguage;
  showCopyCode?: boolean;
  className?: string;
}) {
  const highlightResult = useCodeHighlighter({ code, lang });

  return (
    <Pre
      className={className}
      data-language={lang}
      data-copy={showCopyCode ? "" : undefined}
      data-word-wrap=""
    >
      <code
        // "nextra-code" hooks into Nextra's CSS for copy buttons and styling.
        // Important: Nextra applies `display: grid` to this <code> element.
        // In a CSS grid, whitespace-only text nodes (like \n) are discarded by the browser.
        // Because Shiki outputs lines as inline <span> elements, an empty line becomes an empty span with 0 height.
        // Without the \n to force a line break, empty lines completely disappear in the grid!
        // To fix this, "[&>.line]:block" forces each line to be a block, and "[&>.line]:min-h-[1lh]"
        // gives empty spans exactly 1 line-height of height — matching normal lines perfectly.
        className="nextra-code [&>.line]:block [&>.line]:min-h-lh"
        dir="ltr"
        style={{ color: highlightResult.color || undefined }}
        dangerouslySetInnerHTML={{ __html: highlightResult.html }}
      />
    </Pre>
  );
}
