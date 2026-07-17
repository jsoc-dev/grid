"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

import {
  resolveDocsParams,
  setCookieDocsParams,
  setUrlDocsParams,
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

      setUrlDocsParams(params, docsParams);
      setCookieDocsParams(document, docsParams);

      const query = params.toString();

      // this sends a new request to server, ensuring that new page content is rendered based on new params
      router.push(query ? `${pathname}?${query}` : pathname, {
        scroll: false, // so that scroll position doesn't reset when user changes DocsParams
      });
    },
    [pathname, router, searchParams],
  );

  return updateDocsParams;
}
