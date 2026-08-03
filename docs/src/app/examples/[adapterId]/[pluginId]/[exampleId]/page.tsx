import { ExamplePage } from "@/components/examples/ExamplePage";
import { ExamplesPageShell } from "@/components/examples/ExamplesPageShell";
import type { ExamplesPageProps } from "@/types/examples-routes";
import {
  getAdapterIds,
  getAdapterMetadata,
  getExampleIds,
  getExampleMetadata,
  getPluginIds,
  getPluginMetadata,
} from "@jsoc/grid-docs";
import type { Metadata } from "next";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAdapterIds().flatMap((adapterId) =>
    getPluginIds(adapterId).flatMap((pluginId) =>
      getExampleIds(adapterId, pluginId).map((exampleId) => ({
        adapterId,
        pluginId,
        exampleId,
      })),
    ),
  );
}

export async function generateMetadata(
  props: ExamplesPageProps<"/examples/[adapterId]/[pluginId]/[exampleId]">,
): Promise<Metadata> {
  const { adapterId, pluginId, exampleId } = await props.params;

  const adapter = getAdapterMetadata(adapterId);
  const plugin = getPluginMetadata(adapterId, pluginId);
  const example = getExampleMetadata(adapterId, pluginId, exampleId);

  const title = `${example.name} for ${plugin.name} in ${adapter.frameworkName}`;
  const description =
    example.description ??
    `View the ${example.name} example for ${plugin.name} in ${adapter.frameworkName}.`;

  return { title, description };
}

export default async function Page(
  props: ExamplesPageProps<"/examples/[adapterId]/[pluginId]/[exampleId]">,
) {
  const params = await props.params;

  return (
    <ExamplesPageShell params={params}>
      <ExamplePage {...params} />
    </ExamplesPageShell>
  );
}
