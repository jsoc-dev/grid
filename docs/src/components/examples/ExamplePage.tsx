import { ExampleViewer } from "@/components/examples/example/ExampleViewer";
import { ExamplePageLayout } from "@/components/examples/ExamplePageLayout";
import {
  type ExampleLocator,
  type AdapterId,
  type PluginId,
  getExampleMetadata,
} from "@jsoc/grid-docs";
import clsx from "clsx";

type Props<A extends AdapterId, P extends PluginId<A>> = ExampleLocator<A, P>;

export function ExamplePage<A extends AdapterId, P extends PluginId<A>>({
  adapterId,
  pluginId,
  exampleId,
}: Props<A, P>) {
  const metadata = getExampleMetadata(adapterId, pluginId, exampleId);
  const commonCls = "w-full max-w-(--nextra-content-width) mx-auto";
  return (
    <ExamplePageLayout
      title={metadata.name}
      titleCls={clsx(commonCls, "text-left")}
    >
      <div className={clsx(commonCls, "flex flex-1 flex-col gap-6")}>
        {metadata.description}
        <ExampleViewer {...{ adapterId, pluginId, exampleId }} />
      </div>
    </ExamplePageLayout>
  );
}
