"use client";

import { CodeExplorer } from "@/components/code-explorer/CodeExplorer";
import { ExampleControls } from "@/components/docs/example/ExampleControls";
import type { ExampleId, AdapterId, PluginId } from "@jsoc/grid-docs";
import { Activity, useState } from "react";

type Props = {
  adapterId: AdapterId;
  pluginId: PluginId<AdapterId>;
  exampleId: ExampleId<AdapterId, PluginId<AdapterId>>;
};

export function ExampleClient({ adapterId, pluginId, exampleId }: Props) {
  const [showCode, setShowCode] = useState(false);

  return (
    <>
      <ExampleControls showCode={showCode} setShowCode={setShowCode} />

      <Activity mode={showCode ? "visible" : "hidden"}>
        <div className="h-64">
          <CodeExplorer {...{ adapterId, pluginId, exampleId }} />
        </div>
      </Activity>
    </>
  );
}
