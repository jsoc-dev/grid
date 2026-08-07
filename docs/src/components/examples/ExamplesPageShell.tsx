import { Breadcrumbs } from "@/components/Breadcrumbs";
import type { ExamplesParams } from "@/types/examples-routes";
import {
  getAdapterMetadata,
  getExampleMetadata,
  getPluginMetadata,
} from "@jsoc/grid-docs";
import clsx from "clsx";
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

  let isViewerPage = false;
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
        isViewerPage = true;
        const { exampleId } = params;
        segments.push({
          slug: exampleId,
          label: getExampleMetadata(adapterId, pluginId, exampleId).name,
        });
      }
    }
  }

  return (
    <div
      className={clsx(
        "flex flex-1 flex-col w-full max-w-full",
        isViewerPage ? "h-fill-page overflow-hidden" : "min-h-fill-page", // chooser pages can't have fixed height otherwise they will overflow out of the page in small screens, viewer page must have fixed height otherwise it will grow on opening long content files
      )}
    >
      <Breadcrumbs segments={segments} />
      {children}
    </div>
  );
}
