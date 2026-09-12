"use client";

import { getAdapterIcon } from "@/icons/adapters";
import {
  GROUPED_API_PACKAGE_NAMES,
  withPackageScope,
} from "@/utils/api/api-packages";
import { getAdapterMetadata } from "@jsoc/grid-docs";
import { ShowcaseCard } from "@/components/home/ShowcaseCard";
import { ArrowDown, ArrowUpDown, Cpu, FileJson } from "lucide-react";

export type FrameworkFlowAdapterId = "react-grid" | "vue-grid" | "vanilla-grid";

const FRAMEWORK_ADAPTERS: FrameworkFlowAdapterId[] = [
  "react-grid",
  "vue-grid",
  "vanilla-grid",
];

const FRAMEWORK_ITEMS = FRAMEWORK_ADAPTERS.map((id) => {
  const metadata = getAdapterMetadata(id);
  const Icon = getAdapterIcon(id);
  return {
    id,
    name: metadata.frameworkName,
    packageName: metadata.packageName,
    icon: <Icon className="size-5 shrink-0" />,
  };
});

type FrameworkFlowDiagramProps = {
  activeFramework: FrameworkFlowAdapterId;
  onSelectFramework: (id: FrameworkFlowAdapterId) => void;
};

const corePackage = withPackageScope(GROUPED_API_PACKAGE_NAMES.corePackage);

export function FrameworkFlowDiagram({
  activeFramework,
  onSelectFramework,
}: FrameworkFlowDiagramProps) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-neutral-200 bg-panel-surface p-6 sm:p-8 dark:border-neutral-800">
      {/* 1. Input Data Node */}
      <div className="flex items-center gap-2 rounded-lg border border-dashed border-neutral-300 bg-neutral-50 px-3.5 py-1.5 text-xs font-mono text-neutral-600 dark:border-neutral-700 dark:bg-neutral-900/60 dark:text-neutral-400">
        <FileJson className="size-3.5 text-accent-600 dark:text-accent-400" />
        <span>Unknown JSON Payload</span>
      </div>

      <ArrowDown className="size-4 text-neutral-400" />

      {/* 2. Framework adapters — the entrypoint: they receive the JSON payload */}
      <div className="grid w-full grid-cols-1 gap-2.5 sm:grid-cols-3">
        {FRAMEWORK_ITEMS.map((item) => {
          const isActive = item.id === activeFramework;

          return (
            <ShowcaseCard
              key={item.id}
              icon={item.icon}
              title={`${item.name} Adapter`}
              subtitle={item.packageName}
              selected={isActive}
              onSelect={() => onSelectFramework(item.id)}
              align="center"
              size="sm"
            />
          );
        })}
      </div>

      <div
        className="flex w-full items-center justify-center gap-2"
        title="Adapters and the core engine communicate both ways"
      >
        <ArrowUpDown className="size-4 text-neutral-400" />
      </div>

      {/* 3. Shared core engine — adapters delegate schema inference to it */}
      <ShowcaseCard
        icon={<Cpu />}
        title="Core Engine"
        subtitle={corePackage}
        tone="accent"
        align="center"
        bareIcon
        className="w-full max-w-sm"
      />
    </div>
  );
}
