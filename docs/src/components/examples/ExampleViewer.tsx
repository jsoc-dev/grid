"use client";

import { ExamplePreview } from "@/components/generic/example-preview/ExamplePreview";
import {
  getExampleMetadata,
  type ExampleOptions,
  type FrameworkId,
  type PluginId,
} from "@jsoc/grid-docs";

type Props<F extends FrameworkId, P extends PluginId<F>> = ExampleOptions<F, P>;

export function ExampleViewer<F extends FrameworkId, P extends PluginId<F>>({
  frameworkId,
  pluginId,
  exampleId,
}: Props<F, P>) {
  const { name, description } = getExampleMetadata(
    frameworkId,
    pluginId,
    exampleId,
  );
  
  return (
    <div className="flex flex-col gap-4 flex-1 p-6">
      <h1 className="text-2xl font-bold">{name}</h1>
      <p>{description}</p>

      <div className="flex flex-1 justify-center items-center ">
        <ExamplePreview
          frameworkId={frameworkId}
          pluginId={pluginId}
          exampleId={exampleId}
        >
          {({ preview }) => preview}
        </ExamplePreview>
      </div>
    </div>
  );
}
