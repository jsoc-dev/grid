"use client";

import { CodeExplorer } from "@/components/code-explorer/CodeExplorer";
import { ExamplePreviewProvider } from "@/components/example-preview/ExamplePreviewContext";
import { ExamplePreviewWindow } from "@/components/examples/example/ExamplePreviewWindow";
import { Code2, Eye } from "lucide-react";
import { Activity, useState } from "react";
import clsx from "clsx";

import {
  type ExampleLocator,
  type AdapterId,
  type PluginId,
} from "@jsoc/grid-docs";

type Props<A extends AdapterId, P extends PluginId<A>> = ExampleLocator<A, P>;

type ActiveTab = "code" | "preview";

const TABS = [
  { value: "preview" as const, label: "Preview", Icon: Eye },
  { value: "code" as const, label: "Code", Icon: Code2 },
] as const;

export function ExampleViewer<A extends AdapterId, P extends PluginId<A>>({
  adapterId,
  pluginId,
  exampleId,
}: Props<A, P>) {
  const [activeTab, setActiveTab] = useState<ActiveTab>("preview");

  return (
    <div className="flex flex-1 flex-col min-h-0 w-full overflow-hidden gap-3">
      <div
        role="tablist"
        aria-label="View toggle"
        className="flex items-center gap-1 self-start rounded-full bg-neutral-100 p-1 dark:bg-neutral-800 shrink-0"
      >
        {TABS.map(({ value, label, Icon }) => (
          <TabButton
            key={value}
            active={activeTab === value}
            onClick={() => setActiveTab(value)}
            label={label}
            Icon={Icon}
          />
        ))}
      </div>

      <div className="flex flex-1 min-h-0 flex-col overflow-hidden">
        {/* Outer div controls layout & stretching; Activity preserves state and suspends hidden trees */}
        <div
          className={clsx(
            "flex flex-1 min-h-0 min-w-0 flex-col",
            activeTab !== "code" && "hidden",
          )}
        >
          <Activity mode={activeTab === "code" ? "visible" : "hidden"}>
            <CodeExplorer {...{ adapterId, pluginId, exampleId }} />
          </Activity>
        </div>
        <div
          className={clsx(
            "flex flex-1 min-h-0 min-w-0 flex-col",
            activeTab !== "preview" && "hidden",
          )}
        >
          <Activity mode={activeTab === "preview" ? "visible" : "hidden"}>
            <ExamplePreviewProvider {...{ adapterId, pluginId, exampleId }}>
              <ExamplePreviewWindow />
            </ExamplePreviewProvider>
          </Activity>
        </div>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  label,
  Icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  Icon: typeof Eye;
}) {
  return (
    <button
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer",
        active
          ? "bg-white dark:bg-neutral-700 shadow-sm text-neutral-900 dark:text-neutral-100"
          : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200",
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}
