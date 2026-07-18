"use client";

import { ExternalLink, RotateCcw } from "lucide-react";
import { PanelHeader } from "@/components/playground/panel/PanelHeader";
import { ExamplePreview } from "@/components/example-preview/ExamplePreview";
import { usePlaygroundContext } from "@/components/playground/PlaygroundContext";
import {
  ExamplePreviewProvider,
  useExamplePreviewContext,
} from "@/components/example-preview/ExamplePreviewContext";

export function OutputPanel() {
  const { selectedAdapterId, selectedPluginId } = usePlaygroundContext();

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <ExamplePreviewProvider
        adapterId={selectedAdapterId}
        pluginId={selectedPluginId}
        exampleId="localData"
      >
        <PreviewWithControls />
      </ExamplePreviewProvider>
    </div>
  );
}

function PreviewWithControls() {
  const { openPreviewInNewTab, viewSourceOnGitHub, reloadPreview } =
    useExamplePreviewContext();

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      {/* controls */}
      <PanelHeader heading="Live Preview">
        <PanelHeader.Button
          label="Open in new tab"
          Icon={ExternalLink}
          onClick={openPreviewInNewTab}
        />
        <PanelHeader.Button
          label="View on GitHub"
          Icon={ExternalLink}
          onClick={viewSourceOnGitHub}
        />
        <PanelHeader.Button
          label="Reload"
          Icon={RotateCcw}
          onClick={reloadPreview}
        />
      </PanelHeader>

      {/* iframe */}
      <div className="min-h-0 flex-1">
        <ExamplePreview />
      </div>
    </div>
  );
}
