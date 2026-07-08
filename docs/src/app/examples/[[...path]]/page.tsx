import { Breadcrumbs } from "@/components/examples/Breadcrumbs";
import { ChooseAdapter } from "@/components/examples/ChooseAdapter";
import { ChooseExample } from "@/components/examples/ChooseExample";
import { ChoosePlugin } from "@/components/examples/ChoosePlugin";
import { LiveExample } from "@/components/examples/LiveExample";
import {
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
  const [adapterId, pluginId, exampleId] = path;
  let content;

  if (path.length > 3) {
    notFound();
  } else if (!adapterId) {
    content = <ChooseAdapter />;
  } else if (!isValidAdapterId(adapterId)) {
    notFound();
  } else if (!pluginId) {
    content = <ChoosePlugin adapterId={adapterId} />;
  } else if (!isValidPluginId(adapterId, pluginId)) {
    notFound();
  } else if (!exampleId) {
    content = <ChooseExample adapterId={adapterId} pluginId={pluginId} />;
  } else if (!isValidExampleId(adapterId, pluginId, exampleId)) {
    notFound();
  } else {
    content = (
      <LiveExample
        adapterId={adapterId}
        pluginId={pluginId}
        exampleId={exampleId}
      />
    );
  }

  return (
    <div className="flex flex-1 flex-col h-fill-page">
      <Breadcrumbs path={path} />
      <main className="flex flex-1 px-6">{content}</main>
    </div>
  );
}
