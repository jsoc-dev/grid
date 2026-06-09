"use client";

import { ExamplePreview } from "@/components/generic/example-preview/ExamplePreview";
import {
  getExampleMetadata,
  type ExampleLocator,
  type AdapterId,
  type PluginId,
} from "@jsoc/grid-docs";

type Props<A extends AdapterId, P extends PluginId<A>> = ExampleLocator<A, P>;

export function ExampleViewer<A extends AdapterId, P extends PluginId<A>>({
  adapterId,
  pluginId,
  exampleId,
}: Props<A, P>) {
  const { name, description } = getExampleMetadata(
    adapterId,
    pluginId,
    exampleId,
  );

  return (
    <div className="flex flex-col gap-4 flex-1 p-6">
      <h1 className="text-2xl font-bold">{name}</h1>
      <p>{description}</p>

      <div className="flex flex-1 justify-center items-center ">
        <ExamplePreview
          adapterId={adapterId}
          pluginId={pluginId}
          exampleId={exampleId}
        >
          {({ preview }) => preview}
        </ExamplePreview>
      </div>
    </div>
  );
}
