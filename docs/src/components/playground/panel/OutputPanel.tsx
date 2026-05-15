"use client";

import { ExternalLink, RotateCcw } from "lucide-react";
import { PanelHeader } from "@/components/playground/panel/PanelHeader";
import { ExamplePreview } from "@/components/generic/example-preview/ExamplePreview";
import { usePlaygroundContext } from "@/contexts/PlaygroundContext";

export function OutputPanel() {
  const { selectedFrameworkId, selectedPluginId } = usePlaygroundContext();

  return (
    <div className="flex-1 flex flex-col min-h-0 relative gap-3">
      <ExamplePreview
        frameworkId={selectedFrameworkId}
        pluginId={selectedPluginId}
        // @ts-expect-error - exampleId is resolving to never
        exampleId="local-data"
      >
        {(params) => {
          const { preview, isPending } = params;
          const disableButtons = !!(isPending || params.error);
          const openInNewTab = disableButtons ? undefined : params.openInNewTab;
          const reload = disableButtons ? undefined : params.reload;

          return (
            <>
              <PanelHeader heading="Live Preview">
                <PanelHeader.Button
                  label="Open"
                  Icon={ExternalLink}
                  disabled={disableButtons}
                  onClick={openInNewTab}
                />
                <PanelHeader.Button
                  label="Reload"
                  Icon={RotateCcw}
                  disabled={disableButtons}
                  onClick={reload}
                />
              </PanelHeader>
              <div className="flex-1">{preview}</div>
            </>
          );
        }}
      </ExamplePreview>
    </div>
  );
}
