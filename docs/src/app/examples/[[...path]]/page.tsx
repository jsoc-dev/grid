import { ChooseExample } from "@/components/examples/ChooseExample";
import { ExampleViewer } from "@/components/examples/ExampleViewer";
import { ChooseFramework } from "@/components/examples/ChooseFramework";
import { Breadcrumbs } from "@/components/examples/Breadcrumbs";
import { ChoosePlugin } from "@/components/examples/ChoosePlugin";
import {
  isValidExampleId,
  isValidPluginId,
  isValidFrameworkId,
} from "@jsoc/grid-docs";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

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
  const [frameworkId, pluginId, exampleId] = path;
  let content;

  if (path.length > 3) {
    notFound();
  } else if (!frameworkId) {
    content = <ChooseFramework />;
  } else if (!isValidFrameworkId(frameworkId)) {
    notFound();
  } else if (!pluginId) {
    content = <ChoosePlugin frameworkId={frameworkId} />;
  } else if (!isValidPluginId(frameworkId, pluginId)) {
    notFound();
  } else if (!exampleId) {
    content = <ChooseExample frameworkId={frameworkId} pluginId={pluginId} />;
  } else if (!isValidExampleId(frameworkId, pluginId, exampleId)) {
    notFound();
  } else {
    content = (
      <ExampleViewer
        frameworkId={frameworkId}
        pluginId={pluginId}
        exampleId={exampleId}
      />
    );
  }

  return (
    <div className="flex flex-1 flex-col min-h-[calc(100dvh-var(--nextra-navbar-height))]">
      <Breadcrumbs path={path} />
      <main className="flex flex-1 px-6">{content}</main>
    </div>
  );
}
