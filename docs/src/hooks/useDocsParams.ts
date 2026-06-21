"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

import {
  ADAPTER_ID_PARAM_KEY,
  CONTENT_DIR_BASE_PATH,
  type DocsParams,
  PLUGIN_ID_PARAM_KEY,
} from "@/constants/docs";
import { resolveDocsParams } from "@/utils/resolveDocsParams";

export function useDocsParams(): DocsParams {
  const searchParams = useSearchParams();

  return resolveDocsParams(searchParams);
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

      router.push(query ? `${targetPathname}?${query}` : targetPathname, {
        scroll: false, // so that scroll position doesn't reset when user changes DocsParams
      });
    },
    [targetPathname, router, searchParams],
  );

  return updateDocsParams;
}
