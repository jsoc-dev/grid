"use client";

import { ExamplePreview } from "@/components/ExamplePreview";
import { ADAPTER_ID_PARAM_KEY, PLUGIN_ID_PARAM_KEY } from "@/constants/docs";
import { useDocsParams } from "@/hooks/useDocsParams";
import type { ExampleId, AdapterId, PluginId } from "@jsoc/grid-docs";
import { Activity, useState } from "react";
import { CodeExplorer } from "@/components/code-explorer/CodeExplorer";
import { ExampleControls } from "@/components/docs/example/ExampleControls";

type Props = {
  exampleId: ExampleId<AdapterId, PluginId<AdapterId>>;
};

/**
 * Readonly example preview and source code viewer for documentation pages.
 */
export function Example({ exampleId }: Props) {
  const [showCode, setShowCode] = useState(false);
  const docsParams = useDocsParams();
  const adapterId = docsParams[ADAPTER_ID_PARAM_KEY];
  const pluginId = docsParams[PLUGIN_ID_PARAM_KEY];
  return (
    <ExamplePreview.Provider
      adapterId={adapterId}
      pluginId={pluginId}
      exampleId={exampleId}
    >
      <div className="flex flex-col gap-3">
        <div className="w-full h-64 overflow-hidden">
          <ExamplePreview />
        </div>

        <ExampleControls showCode={showCode} setShowCode={setShowCode} />

        <Activity mode={showCode ? "visible" : "hidden"}>
          <div className="h-64">
            <CodeExplorer
              adapterId={adapterId}
              pluginId={pluginId}
              exampleId={exampleId}
            />
          </div>
        </Activity>
      </div>
    </ExamplePreview.Provider>
  );
}
