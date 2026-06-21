import {
  ADAPTER_ID_PARAM_KEY,
  DEFAULT_ADAPTER_ID,
  DEFAULT_PLUGIN_ID,
  type DocsParams,
  PLUGIN_ID_PARAM_KEY,
} from "@/constants/docs";
import type { PageSearchParams } from "@/types/next";
import { isValidAdapterId, isValidPluginId } from "@jsoc/grid-docs";

type SearchParams = URLSearchParams | PageSearchParams;

export function resolveDocsParams(searchParams: SearchParams): DocsParams {
  const adapterIdParam = getSearchParamValue(
    searchParams,
    ADAPTER_ID_PARAM_KEY,
  );
  const pluginIdParam = getSearchParamValue(searchParams, PLUGIN_ID_PARAM_KEY);

  const adapterId =
    adapterIdParam && isValidAdapterId(adapterIdParam)
      ? adapterIdParam
      : DEFAULT_ADAPTER_ID;

  const pluginId =
    pluginIdParam && isValidPluginId(adapterId, pluginIdParam)
      ? pluginIdParam
      : DEFAULT_PLUGIN_ID;

  return {
    adapterId,
    pluginId,
  };
}

function getSearchParamValue(
  searchParams: SearchParams,
  key: string,
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
