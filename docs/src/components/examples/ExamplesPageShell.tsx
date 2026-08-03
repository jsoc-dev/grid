import { Breadcrumbs } from "@/components/Breadcrumbs";
import type { ExamplesParams } from "@/types/examples-routes";
import {
  getAdapterMetadata,
  getExampleMetadata,
  getPluginMetadata,
} from "@jsoc/grid-docs";
import type { ReactNode } from "react";

type ExamplesPageShellProps = {
  params?: ExamplesParams;
  children: ReactNode;
};

export function ExamplesPageShell({
  params = {},
  children,
}: ExamplesPageShellProps) {
  const segments = [{ slug: "examples", label: "Examples" }];

  if ("adapterId" in params) {
    const { adapterId } = params;
    segments.push({
      slug: adapterId,
      label: getAdapterMetadata(adapterId).frameworkName,
    });

    if ("pluginId" in params) {
      const { pluginId } = params;
      segments.push({
        slug: pluginId,
        label: getPluginMetadata(adapterId, pluginId).name,
      });

      if ("exampleId" in params) {
        const { exampleId } = params;
        segments.push({
          slug: exampleId,
          label: getExampleMetadata(adapterId, pluginId, exampleId).name,
        });
      }
    }
  }

  return (
    <div className="flex flex-1 flex-col min-h-fill-page w-full max-w-full">
      <Breadcrumbs segments={segments} />
      {children}
    </div>
  );
}
