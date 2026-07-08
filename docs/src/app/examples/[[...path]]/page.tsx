import { Breadcrumbs } from "@/components/examples/Breadcrumbs";
import { ChooseAdapter } from "@/components/examples/ChooseAdapter";
import { ChooseExample } from "@/components/examples/ChooseExample";
import { ChoosePlugin } from "@/components/examples/ChoosePlugin";
import { ExampleViewer } from "@/components/examples/example/ExampleViewer";
import {
  getExampleMetadata,
  isValidAdapterId,
  isValidExampleId,
  isValidPluginId,
} from "@jsoc/grid-docs";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata(
  props: PageProps<"/examples/[[...path]]">,
): Promise<Metadata> {
  const params = await props.params;
  const { path = [] } = params;

  const suffix = path.length > 0 ? ` - ${path.join("/")}` : "";
  const title = `Example ${suffix}`;

  return { title };
}

export default async function Page(props: PageProps<"/examples/[[...path]]">) {
  const { path = [] } = await props.params;

  return (
    <div className="flex flex-1 flex-col h-fill-page w-full max-w-full">
      <Breadcrumbs path={path} />
      <main className="flex flex-1 flex-col px-6 min-w-0 min-h-0 max-w-full w-full">
        <Content path={path} />
      </main>
    </div>
  );
}

function Content({ path }: { path: string[] }) {
  const [adapterId, pluginId, exampleId] = path;

  if (path.length > 3) notFound();
  if (!adapterId) return <ChooseAdapter />;
  if (!isValidAdapterId(adapterId)) notFound();
  if (!pluginId) return <ChoosePlugin {...{ adapterId }} />;
  if (!isValidPluginId(adapterId, pluginId)) notFound();
  if (!exampleId) return <ChooseExample {...{ adapterId, pluginId }} />;
  if (!isValidExampleId(adapterId, pluginId, exampleId)) notFound();

  const metadata = getExampleMetadata(adapterId, pluginId, exampleId);

  return (
    <div className="flex flex-col gap-8 flex-1 pb-10 min-w-0 min-h-0 w-full max-w-(--nextra-content-width) mx-auto">
      <div className="shrink-0 pt-6">
        <h1 className="text-2xl font-bold">{metadata.name}</h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          {metadata.description}
        </p>
      </div>

      <ExampleViewer {...{ adapterId, pluginId, exampleId }} />
    </div>
  );
}
