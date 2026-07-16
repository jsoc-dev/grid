"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

import {
  resolveDocsParams,
  setDocsParamsInUrl,
  type DocsParams,
} from "@/utils/docsParams";

export function useDocsParams(): DocsParams {
  const searchParams = useSearchParams();

  return resolveDocsParams(searchParams);
}

export function useUpdateDocsParams() {
  const router = useRouter();
  const pathname = usePathname();

  const searchParams = useSearchParams();

  const updateDocsParams = useCallback(
    (docsParams: DocsParams) => {
      const params = new URLSearchParams(searchParams.toString());

      setDocsParamsInUrl(docsParams, params);

      const query = params.toString();

      router.push(query ? `${pathname}?${query}` : pathname, {
        scroll: false, // so that scroll position doesn't reset when user changes DocsParams
      });
    },
    [pathname, router, searchParams],
  );

  return updateDocsParams;
}
