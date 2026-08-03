import { ChoosePlugin } from "@/components/examples/ChoosePlugin";
import { ExamplesPageShell } from "@/components/examples/ExamplesPageShell";
import type {
  ExamplesPageProps,
  ExamplesStaticParamsList,
} from "@/types/examples-routes";
import { getAdapterIds, getAdapterMetadata } from "@jsoc/grid-docs";
import type { Metadata } from "next";

export const dynamicParams = false;

export function generateStaticParams(): ExamplesStaticParamsList<"/examples/[adapterId]"> {
  return getAdapterIds().map((adapterId) => ({ adapterId }));
}

export async function generateMetadata(
  props: ExamplesPageProps<"/examples/[adapterId]">,
): Promise<Metadata> {
  const { adapterId } = await props.params;
  const adapter = getAdapterMetadata(adapterId);

  const title = `Examples for ${adapter.frameworkName}`;
  const description = `Browse examples for ${adapter.frameworkName}.`;

  return { title, description };
}

/** Plugin selection page for a specific adapter. */
export default async function Page(
  props: ExamplesPageProps<"/examples/[adapterId]">,
) {
  const params = await props.params;

  return (
    <ExamplesPageShell params={params}>
      <ChoosePlugin {...params} />
    </ExamplesPageShell>
  );
}
