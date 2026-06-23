"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

import { isValidAdapterId, isValidPluginId } from "@jsoc/grid-docs";
import {
  ADAPTER_ID_PARAM_KEY,
  CONTENT_DIR_BASE_PATH,
  DEFAULT_ADAPTER_ID,
  DEFAULT_PLUGIN_ID,
  type DocsParams,
  PLUGIN_ID_PARAM_KEY,
} from "@/constants/docs";

export function useDocsParams(): DocsParams {
  const searchParams = useSearchParams();

  const adapterIdParam = searchParams.get(ADAPTER_ID_PARAM_KEY);
  const pluginIdParam = searchParams.get(PLUGIN_ID_PARAM_KEY);

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

export function useUpdateDocsParams() {
  const router = useRouter();
  const pathname = usePathname();
  const targetPathname = pathname.startsWith(CONTENT_DIR_BASE_PATH)
    ? pathname
    : CONTENT_DIR_BASE_PATH;

  const searchParams = useSearchParams();

  const updateDocsParams = useCallback(
    (docsParams: DocsParams) => {
      const params = new URLSearchParams(searchParams.toString());

      params.set(ADAPTER_ID_PARAM_KEY, docsParams[ADAPTER_ID_PARAM_KEY]);
      params.set(PLUGIN_ID_PARAM_KEY, docsParams[PLUGIN_ID_PARAM_KEY]);

      const query = params.toString();

      router.push(query ? `${targetPathname}?${query}` : targetPathname);
    },
    [targetPathname, router, searchParams],
  );

  return updateDocsParams;
}
