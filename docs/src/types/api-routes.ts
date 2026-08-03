import type { ApiPackageName } from "@/utils/api/api-packages";
import type { AppRoutes } from "private-next-root-dir/.next/types/routes";

export type ApiRoutes = Extract<AppRoutes, `/api${string}`>;

export type ApiParamsByRoute = {
  "/api": Record<string, never>;
  "/api/[packageName]": { packageName: ApiPackageName };
  "/api/[packageName]/[apiName]": {
    packageName: ApiPackageName;
    apiName: string;
  };
};

export type ApiParams = ApiParamsByRoute[ApiRoutes];

export type ApiStaticParamsList<Route extends ApiRoutes> =
  ApiParamsByRoute[Route][];

/**
 * Typed page props for API routes.
 * Param validity is enforced by `generateStaticParams` with `dynamicParams = false`.
 */
export type ApiPageProps<Route extends ApiRoutes> = PageProps<Route> & {
  params: Promise<ApiParamsByRoute[Route]>;
};
