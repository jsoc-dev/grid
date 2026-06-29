"use client";

import { ExamplePreview } from "@/components/ExamplePreview";
import { ADAPTER_ID_PARAM_KEY, PLUGIN_ID_PARAM_KEY } from "@/constants/docs";
import { useDocsParams } from "@/hooks/useDocsParams";
import type { ExampleId, AdapterId, PluginId } from "@jsoc/grid-docs";
import { useState } from "react";
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
    <div className="flex flex-col gap-4">
      <ExamplePreview.Provider
        adapterId={adapterId}
        pluginId={pluginId}
        exampleId={exampleId}
      >
        <div className="flex flex-col gap-2">
          <div className="w-full h-64 checkerboard overflow-hidden">
            <ExamplePreview />
          </div>

          <div className="flex flex-col">
            <div className="p-2">
              <ExampleControls showCode={showCode} setShowCode={setShowCode} />
            </div>

            {showCode && (
              <CodeExplorer
                adapterId={adapterId}
                pluginId={pluginId}
                exampleId={exampleId}
              />
            )}
          </div>
        </div>
      </ExamplePreview.Provider>
    </div>
  );
}
