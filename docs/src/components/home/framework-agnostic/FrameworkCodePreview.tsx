"use client";

import { CodeBlock } from "@/components/CodeBlock";
import { getAdapterIcon } from "@/icons/adapters";
import { getAdapterMetadata, type CodeLanguage } from "@jsoc/grid-docs";
import clsx from "clsx";
import type { FrameworkFlowAdapterId } from "@/components/home/framework-agnostic/FrameworkFlowDiagram";

export type FrameworkSnippetData = {
  adapterId: FrameworkFlowAdapterId;
  fileName: string;
  language: CodeLanguage;
  code: string;
};

type FrameworkCodePreviewProps = {
  activeFramework: FrameworkFlowAdapterId;
  onSelectFramework: (id: FrameworkFlowAdapterId) => void;
  snippets: Record<FrameworkFlowAdapterId, FrameworkSnippetData>;
};

const FRAMEWORK_IDS: FrameworkFlowAdapterId[] = [
  "react-grid",
  "vue-grid",
  "vanilla-grid",
];

const FRAMEWORK_TABS = FRAMEWORK_IDS.map((id) => {
  const metadata = getAdapterMetadata(id);
  const Icon = getAdapterIcon(id);
  return {
    id,
    name: metadata.frameworkName,
    icon: <Icon className="size-4 shrink-0" />,
  };
});

export function FrameworkCodePreview({
  activeFramework,
  onSelectFramework,
  snippets,
}: FrameworkCodePreviewProps) {
  const activeSnippet = snippets[activeFramework];

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-neutral-200 bg-panel-surface dark:border-neutral-800">
      {/* Tab Header */}
      <div className="flex items-stretch justify-between border-b border-neutral-200 px-3 dark:border-neutral-800">
        <div className="flex items-stretch gap-1">
          {FRAMEWORK_TABS.map((tab) => {
            const isActive = tab.id === activeFramework;

            return (
              <button
                key={tab.id}
                type="button"
                title={tab.name}
                aria-label={tab.name}
                onClick={() => onSelectFramework(tab.id)}
                className={clsx(
                  "-mb-px cursor-pointer border-b-2 px-2 pt-2 pb-2 transition-colors outline-none",
                  isActive
                    ? "border-accent-500 text-accent-600 dark:border-accent-400 dark:text-accent-400"
                    : "border-transparent text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white",
                )}
              >
                {tab.icon}
              </button>
            );
          })}
        </div>

        <span className="self-center text-[11px] font-mono text-neutral-400 dark:text-neutral-500">
          {activeSnippet.fileName}
        </span>
      </div>

      {/* Code Block */}
      {/* Nextra's Pre renders its own wrapper <div class="nextra-code ..."> around <pre>
          (see node_modules/nextra/dist/client/mdx-components/pre/index.js) — it takes no
          className, so lay it out via child selectors. Chain: body (flex column) >
          wrapper (flex-1, margin keeps it off the card border) > pre (flex-1, owns the
          scrollbars). Border + rounded + overflow-hidden live on the wrapper so it clips
          the square scrollbar ends to the curve; pre's inset ring is killed since the
          horizontal scrollbar would cover it. */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden font-mono text-xs [&>.nextra-code]:m-4 [&>.nextra-code]:flex [&>.nextra-code]:min-h-0 [&>.nextra-code]:min-w-0 [&>.nextra-code]:flex-1 [&>.nextra-code]:flex-col [&>.nextra-code]:overflow-hidden [&>.nextra-code]:rounded-md [&>.nextra-code]:border [&>.nextra-code]:border-neutral-200 dark:[&>.nextra-code]:border-neutral-800">
        <CodeBlock
          key={activeFramework}
          code={activeSnippet.code}
          lang={activeSnippet.language}
          className="min-h-0 min-w-0 flex-1 [box-shadow:none]!"
        />
      </div>
    </div>
  );
}
