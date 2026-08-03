import type { AppRoutes } from "private-next-root-dir/.next/types/routes";
import type { AdapterId, ExampleId, PluginId } from "@jsoc/grid-docs";

export type ExamplesRoutes = Extract<AppRoutes, `/examples${string}`>;

export type ExamplesParamsByRoute = {
  "/examples": Record<string, never>;
  "/examples/[adapterId]": { adapterId: AdapterId };
  "/examples/[adapterId]/[pluginId]": {
    adapterId: AdapterId;
    pluginId: PluginId<AdapterId>;
  };
  "/examples/[adapterId]/[pluginId]/[exampleId]": {
    adapterId: AdapterId;
    pluginId: PluginId<AdapterId>;
    exampleId: ExampleId<AdapterId, PluginId<AdapterId>>;
  };
};

export type ExamplesParams = ExamplesParamsByRoute[ExamplesRoutes];

export type ExamplesStaticParamsList<Route extends ExamplesRoutes> =
  ExamplesParamsByRoute[Route][];

/**
 * Typed page props for examples routes.
 * Param validity is enforced by `generateStaticParams` with `dynamicParams = false`.
 */
export type ExamplesPageProps<Route extends ExamplesRoutes> =
  PageProps<Route> & {
    params: Promise<ExamplesParamsByRoute[Route]>;
  };
