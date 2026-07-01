"use client";

import { createHighlighter, type Highlighter } from "shiki";
import { useEffect, useState } from "react";
import { CopyToClipboard } from "nextra/mdx-components/pre/copy-to-clipboard";
import { useTheme } from "next-themes";

let highlighterPromise: Promise<Highlighter> | null = null;

export function CodeBlockShiki({
  code,
  language,
  showCopyCode = true,
}: {
  code: string;
  language: string;
  showCopyCode?: boolean;
}) {
  const [html, setHtml] = useState("");
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    let active = true;

    highlighterPromise ??= createHighlighter({
      themes: ["github-dark", "github-light"],
      langs: ["typescript", "javascript", "html", "css", "json", "vue"],
    });

    highlighterPromise
      .then((highlighter) => {
        if (!active) return;
        const htmlOutput = highlighter.codeToHtml(code, {
          lang: language,
          theme: resolvedTheme === "dark" ? "github-dark" : "github-light",
        });
        setHtml(htmlOutput);
      })
      .catch((err) => {
        console.error("Shiki error", err);
        if (active) setHtml(`<pre><code>${code}</code></pre>`);
      });

    return () => {
      active = false;
    };
  }, [code, language, resolvedTheme]);

  return (
    <div className="group relative flex h-full flex-col bg-white dark:bg-black">
      {showCopyCode && (
        <div className="absolute right-4 top-2 z-10 flex gap-1 opacity-0 transition focus-within:opacity-100 group-hover:opacity-100 group-focus:opacity-100">
          <CopyToClipboard />
        </div>
      )}
      <div
        className="scrollbar-thin h-full overflow-auto p-4 text-[13px] leading-relaxed [&>pre]:bg-transparent! [&_code]:font-mono"
        dangerouslySetInnerHTML={{
          __html: html || `<pre><code>${code}</code></pre>`,
        }}
      />
    </div>
  );
}
