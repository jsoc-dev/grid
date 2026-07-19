import { Breadcrumbs, type BreadcrumbSegment } from "@/components/Breadcrumbs";
import { ChooseAdapter } from "@/components/examples/ChooseAdapter";
import { ChooseExample } from "@/components/examples/ChooseExample";
import { ChoosePlugin } from "@/components/examples/ChoosePlugin";
import { ExamplePage } from "@/components/examples/ExamplePage";
import {
  getAdapterMetadata,
  getExampleMetadata,
  getPluginMetadata,
  isValidAdapterId,
  isValidExampleId,
  isValidPluginId,
  type AdapterId,
  type ExampleId,
  type PluginId,
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

  const adapterId = path[0] as AdapterId | undefined;
  const pluginId = path[1] as PluginId<AdapterId> | undefined;
  const exampleId = path[2] as ExampleId<AdapterId, PluginId> | undefined;

  const segments: BreadcrumbSegment[] = [
    { slug: "examples", label: "Examples" },
  ];

  if (adapterId) {
    segments.push({
      slug: adapterId,
      label: getAdapterMetadata(adapterId).frameworkName,
    });
  }

  if (adapterId && pluginId) {
    segments.push({
      slug: pluginId,
      label: getPluginMetadata(adapterId, pluginId).name,
    });
  }

  if (adapterId && pluginId && exampleId) {
    segments.push({
      slug: exampleId,
      label: getExampleMetadata(adapterId, pluginId, exampleId).name,
    });
  }

  return (
    <div className="flex flex-1 flex-col min-h-fill-page w-full max-w-full">
      <Breadcrumbs segments={segments} />
      <Content path={path} />
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

  return <ExamplePage {...{ adapterId, pluginId, exampleId }} />;
}
