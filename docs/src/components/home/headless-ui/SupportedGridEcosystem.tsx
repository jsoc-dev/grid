"use client";

import { useState } from "react";
import { CodeBlock } from "@/components/CodeBlock";
import { ShowcaseCard } from "@/components/home/ShowcaseCard";
import { getPluginIcon } from "@/icons/plugins";
import {
  getPluginIds,
  getPluginMetadata,
  type CodeLanguage,
  type ReactGridPluginId,
} from "@jsoc/grid-docs";

export type GridPluginSnippetData = {
  pluginId: ReactGridPluginId;
  code: string;
  language: CodeLanguage;
  fileName: string;
  docsHref: string;
};

const PLUGIN_ITEMS = getPluginIds("react-grid").map((id) => {
  const metadata = getPluginMetadata("react-grid", id);
  const Icon = getPluginIcon("react-grid", id);

  return {
    id,
    name: metadata.name,
    shortName: metadata.shortName,
    packageName: metadata.packageName,
    Icon,
  };
});

type SupportedGridEcosystemProps = {
  snippets: Record<ReactGridPluginId, GridPluginSnippetData>;
};

export function SupportedGridEcosystem({
  snippets,
}: SupportedGridEcosystemProps) {
  const [selectedPlugin, setSelectedPlugin] = useState<ReactGridPluginId>("ag");

  const activeSnippet = snippets[selectedPlugin];
  const activeMeta = PLUGIN_ITEMS.find((p) => p.id === selectedPlugin)!;

  return (
    <div className="flex flex-col gap-6">
      {/* Grid Library Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {PLUGIN_ITEMS.map((item) => {
          const isSelected = item.id === selectedPlugin;

          return (
            <ShowcaseCard
              key={item.id}
              icon={<item.Icon className="size-8 shrink-0" />}
              title={item.shortName}
              subtitle={item.packageName}
              selected={isSelected}
              onSelect={() => setSelectedPlugin(item.id)}
              check
            />
          );
        })}
      </div>

      {/* Code Preview for Selected Plugin */}
      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-panel-surface dark:border-neutral-800">
        <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-2.5 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            {<activeMeta.Icon className="size-6 shrink-0" />}
            <span className="text-xs font-semibold text-neutral-900 dark:text-white">
              {activeMeta.name} Integration
            </span>
          </div>
          <span className="text-[11px] font-mono text-neutral-400 dark:text-neutral-500">
            {activeSnippet.fileName}
          </span>
        </div>
        <div className="p-4 font-mono text-xs overflow-auto">
          <CodeBlock
            key={selectedPlugin}
            code={activeSnippet.code}
            lang={activeSnippet.language}
          />
        </div>
      </div>
    </div>
  );
}
