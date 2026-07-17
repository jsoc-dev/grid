import type { PageSearchParams } from "@/types/next";
import {
  getPluginIds,
  isValidAdapterId,
  isValidPluginId,
  type AdapterId,
  type PluginId,
} from "@jsoc/grid-docs";

type SearchParams = URLSearchParams | PageSearchParams;

export type DocsParams = {
  adapterId: AdapterId;
  pluginId: PluginId<AdapterId>;
};

export type DocsParamsKey = keyof DocsParams;

const DEFAULT_ADAPTER_ID = "react-grid" satisfies AdapterId;

export function getDefaultPluginId<A extends AdapterId>(
  adapterId: A,
): PluginId<A> {
  return getPluginIds(adapterId)[0];
}

export function resolveDocsParams(searchParams: SearchParams): DocsParams {
  const adapterIdParam = getDocsParam("adapterId", searchParams);
  const pluginIdParam = getDocsParam("pluginId", searchParams);

  const adapterId =
    adapterIdParam && isValidAdapterId(adapterIdParam)
      ? adapterIdParam
      : DEFAULT_ADAPTER_ID;

  const pluginId =
    pluginIdParam && isValidPluginId(adapterId, pluginIdParam)
      ? pluginIdParam
      : getDefaultPluginId(adapterId);

  return { adapterId, pluginId };
}

function getDocsParam(
  key: DocsParamsKey,
  searchParams: SearchParams,
): string | null {
  if (searchParams instanceof URLSearchParams) {
    return searchParams.getAll(key)[0] ?? null;
  }

  const value = searchParams[key];

  if (value === undefined) {
    return null;
  }

  return Array.isArray(value) ? (value[0] ?? null) : value;
}

export function setDocsParamsInUrl(
  docsParams: DocsParams,
  searchParams: URLSearchParams,
) {
  for (const key in docsParams) {
    searchParams.set(key, docsParams[key as DocsParamsKey]);
  }
}
