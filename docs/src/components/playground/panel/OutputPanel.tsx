"use client";

import { ExternalLink, RotateCcw } from "lucide-react";
import { PanelHeader } from "@/components/playground/panel/PanelHeader";
import { ExamplePreview } from "@/components/ExamplePreview";
import { usePlaygroundContext } from "@/hooks/usePlaygroundContext";
import { type ExampleId } from "@jsoc/grid-docs";

export function OutputPanel() {
  const { selectedAdapterId, selectedPluginId } = usePlaygroundContext();
  const exampleId = "localData" as ExampleId<
    typeof selectedAdapterId,
    typeof selectedPluginId
  >;

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <ExamplePreview
        adapterId={selectedAdapterId}
        pluginId={selectedPluginId}
        exampleId={exampleId}
        className="h-full min-h-0"
      >
        {(params) => {
          const { preview, isPending } = params;
          const disableButtons = !!(isPending || params.error);
          const openInNewTab = disableButtons ? undefined : params.openInNewTab;
          const reload = disableButtons ? undefined : params.reload;

          return (
            <div className="flex min-h-0 flex-1 flex-col gap-3">
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
              <div className="min-h-0 flex-1">{preview}</div>
            </div>
          );
        }}
      </ExamplePreview>
    </div>
  );
}
