import { ChooseExample } from "@/components/examples/ChooseExample";
import { ExamplesPageShell } from "@/components/examples/ExamplesPageShell";
import type {
  ExamplesPageProps,
  ExamplesStaticParamsList,
} from "@/types/examples-routes";
import { createPageMetadata } from "@/utils/og-metadata";
import {
  getAdapterIds,
  getAdapterMetadata,
  getPluginIds,
  getPluginMetadata,
} from "@jsoc/grid-docs";
import type { Metadata } from "next";

export const dynamicParams = false;

export function generateStaticParams(): ExamplesStaticParamsList<"/examples/[adapterId]/[pluginId]"> {
  return getAdapterIds().flatMap((adapterId) =>
    getPluginIds(adapterId).map((pluginId) => ({ adapterId, pluginId })),
  );
}

export async function generateMetadata(
  props: ExamplesPageProps<"/examples/[adapterId]/[pluginId]">,
): Promise<Metadata> {
  const { adapterId, pluginId } = await props.params;
  const adapter = getAdapterMetadata(adapterId);
  const plugin = getPluginMetadata(adapterId, pluginId);

  return createPageMetadata({
    title: `Examples for ${plugin.name} in ${adapter.frameworkName}`,
    description: `Browse examples for ${plugin.name} in ${adapter.frameworkName}.`,
  });
}

/** Example selection page for a specific adapter and plugin. */
export default async function Page(
  props: ExamplesPageProps<"/examples/[adapterId]/[pluginId]">,
) {
  const params = await props.params;

  return (
    <ExamplesPageShell params={params}>
      <ChooseExample {...params} />
    </ExamplesPageShell>
  );
}
