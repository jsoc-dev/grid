"use client";

import { ExamplePreview } from "@/components/ExamplePreview";
import { useExamplePreview } from "@/contexts/ExamplePreviewContext";
import { RotateCw, ExternalLink, Lock } from "lucide-react";
import { useSyncExternalStore } from "react";

// Empty subscription since window.location.origin doesn't change over time
const emptySubscribe = () => () => {};

export function ExamplePreviewWindow() {
  const { url, reloadPreview, openPreviewInNewTab } = useExamplePreview();

  const origin = useSyncExternalStore(
    emptySubscribe,
    () => window.location.origin,
    () => "",
  );

  const displayUrl = origin ? origin + url : "";

  return (
    <div className="bg-panel-surface border border-panel-outline flex-1 flex flex-col min-w-0 rounded-md">
      {/* header */}
      <div className="flex h-10 shrink-0 items-center gap-1.5 px-1.5">
        {/* Reload Action */}
        <button
          type="button"
          onClick={reloadPreview}
          className="shrink-0 cursor-pointer rounded-md p-1 text-neutral-400 hover:bg-black/5 hover:text-neutral-700 dark:text-neutral-500 dark:hover:bg-white/10 dark:hover:text-neutral-300 transition-colors"
          title="Reload preview"
        >
          <RotateCw className="h-4 w-4" />
        </button>

        {/* Address Bar */}
        <div className="flex flex-1 h-6.5 items-center gap-1.5 rounded-md bg-black/5 dark:bg-white/5 px-2 overflow-hidden">
          <Lock className="h-3.5 w-3.5 text-neutral-400 dark:text-neutral-500 shrink-0" />
          <div className="flex-1 truncate text-[11px] text-neutral-500 dark:text-neutral-400">
            {displayUrl}
          </div>
        </div>

        {/* External Link Action */}
        <button
          type="button"
          onClick={openPreviewInNewTab}
          className="shrink-0 cursor-pointer rounded-md p-1 text-neutral-400 hover:bg-black/5 hover:text-neutral-700 dark:text-neutral-500 dark:hover:bg-white/10 dark:hover:text-neutral-300 transition-colors"
          title="Open in new tab"
        >
          <ExternalLink className="h-4 w-4" />
        </button>
      </div>

      {/* Page Content */}
      <div className="h-full w-full overflow-hidden p-2 pt-0.25 ">
        <div className="h-full w-full overflow-hidden rounded-md shadow-sm">
          {displayUrl && <ExamplePreview />}
        </div>
      </div>
    </div>
  );
}
