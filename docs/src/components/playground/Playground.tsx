"use client";

import { FrameworkSelector } from "@/components/playground/FrameworkSelector";
import { PlaygroundContextProvider } from "@/components/playground/PlaygroundContextProvider";
import { PluginSelector } from "@/components/playground/PluginSelector";
import { InputPanel } from "@/components/playground/panel/InputPanel";
import { OutputPanel } from "@/components/playground/panel/OutputPanel";
import { usePlaygroundContext } from "@/contexts/PlaygroundContext";
import {
  getFrameworkIds,
  getPluginIds,
  getPluginMetadata,
} from "@jsoc/grid-docs";

export function Playground() {
  return (
    <PlaygroundContextProvider>
      <PlaygroundContent />
    </PlaygroundContextProvider>
  );
}

function PlaygroundContent() {
  const { selectedFrameworkId } = usePlaygroundContext();

  return (
    <div className="flex flex-col w-full overflow-hidden rounded-xl bg-white dark:bg-zinc-900 shadow-2xl shadow-zinc-200/50 dark:shadow-none border border-zinc-100 dark:border-zinc-800/50">
      {/* Top bar — frameworks pinned left; plugins centered in remaining space */}
      <div className="grid grid-cols-[auto_1fr] items-center border-b border-zinc-100 px-4 dark:border-zinc-800/50 bg-zinc-50/30 dark:bg-zinc-900/30 backdrop-blur-sm">
        <div className="flex items-center gap-1 overflow-x-auto border-r border-zinc-200 pr-2 mr-2 dark:border-zinc-700/50">
          {getFrameworkIds().map((frameworkId) => (
            <FrameworkSelector key={frameworkId} frameworkId={frameworkId} />
          ))}
        </div>
        <div className="flex min-w-0 items-center justify-center gap-1 overflow-x-auto">
          {getPluginIds(selectedFrameworkId).map((pluginId) => (
            <PluginSelector
              key={pluginId}
              frameworkId={selectedFrameworkId}
              pluginId={pluginId}
              meta={getPluginMetadata(selectedFrameworkId, pluginId)}
            />
          ))}
        </div>
      </div>

      {/* split view container*/}
      <div className="p-8 gap-8 flex flex-col md:flex-row h-[700px] md:h-[400px] overflow-hidden dot-pattern">
        <div className="flex-1 flex flex-col min-w-0 order-2 md:order-1">
          <InputPanel />
        </div>
        <div className="flex-[1.6] flex flex-col min-w-0 order-1 md:order-2">
          <OutputPanel />
        </div>
      </div>
    </div>
  );
}
