"use client";

import { SwitchAdapter } from "@/components/playground/header/SwitchAdapter";
import { SwitchPlugin } from "@/components/playground/header/SwitchPlugin";
import { usePlaygroundContext } from "@/hooks/usePlaygroundContext";
import {
  getAdapterIds,
  getPluginIds,
  getPluginMetadata,
} from "@jsoc/grid-docs";

export function PlaygroundHeader() {
  const { selectedAdapterId } = usePlaygroundContext();

  return (
    <div className="flex flex-col border-b border-zinc-100 bg-zinc-50/30 backdrop-blur-sm dark:border-zinc-800/50 dark:bg-zinc-900/30 md:grid md:grid-cols-[auto_1fr] md:items-center">
      <div className="flex items-center gap-0.5 overflow-x-auto border-b border-zinc-200 px-2 py-1 dark:border-zinc-700/50 md:border-b-0 md:border-r md:px-4 md:py-0 md:pr-2 md:mr-2">
        {getAdapterIds().map((adapterId) => (
          <SwitchAdapter key={adapterId} adapterId={adapterId} />
        ))}
      </div>

      <div className="flex min-w-0 items-center justify-start gap-0.5 overflow-x-auto px-2 py-1 md:justify-center md:gap-1 md:px-4 md:py-0">
        {getPluginIds(selectedAdapterId).map((pluginId) => (
          <SwitchPlugin
            key={pluginId}
            adapterId={selectedAdapterId}
            pluginId={pluginId}
            meta={getPluginMetadata(selectedAdapterId, pluginId)}
          />
        ))}
      </div>
    </div>
  );
}
