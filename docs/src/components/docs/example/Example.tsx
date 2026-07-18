import { ExampleClient } from "@/components/docs/example/ExampleClient";
import { ExamplePreview } from "@/components/example-preview/ExamplePreview";
import { ExamplePreviewProvider } from "@/components/example-preview/ExamplePreviewContext";
import { getDynamicContentScope } from "@/utils/dynamicContentScope";
import type { ExampleId, AdapterId, PluginId } from "@jsoc/grid-docs";

type Props = {
  exampleId: ExampleId<AdapterId, PluginId<AdapterId>>;
};

/**
 * Readonly example preview and source code viewer for documentation pages.
 */
export function Example({ exampleId }: Props) {
  const { adapter, plugin } = getDynamicContentScope()!;
  const adapterId = adapter.id;
  const pluginId = plugin.id;
  return (
    <ExamplePreviewProvider {...{ adapterId, pluginId, exampleId }}>
      <div className="flex flex-col gap-3">
        <div className="w-full h-64 overflow-hidden">
          <ExamplePreview />
        </div>
        <ExampleClient {...{ adapterId, pluginId, exampleId }} />
      </div>
    </ExamplePreviewProvider>
  );
}
