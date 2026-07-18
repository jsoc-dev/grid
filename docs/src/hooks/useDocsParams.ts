"use client";

import { useWindow } from "@/hooks/useWindow";
import {
  parseUrlDocsParams,
  resolveDocsParams,
  setCookieDocsParams,
  setUrlDocsParams,
  type DocsParams,
} from "@/utils/docsParams";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

/**
 * Reads the current DocsParams from URL search params and cookie preferences.
 *
 * Returns `undefined` during SSR (when `window` is unavailable) instead of
 * resolving to default values. This forces consumers to render a loading/skeleton
 * UI rather than briefly flashing the default selections before hydration replaces
 * them with the user's actual cookie-persisted preferences.
 */
export function useDocsParams(): DocsParams | undefined {
  const searchParams = useSearchParams();
  const win = useWindow();

  if (!win) return undefined;
  return resolveDocsParams(searchParams, win.document.cookie);
}

/**
 * Persists the resolved DocsParams to cookies whenever the URL search params change.
 *
 * This keeps cookie-stored preferences in sync when the user navigates to a URL
 * that contains DocsParams directly (e.g. a shared link), rather than changing
 * them through the sidebar selectors.
 */
export function useSyncCookieDocsParams() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const docsParams = resolveDocsParams(searchParams, document.cookie);
    setCookieDocsParams(document, docsParams);
  }, [searchParams]);
}

/**
 * Returns a callback to programmatically update the current DocsParams.
 *
 * Cookies are always updated as they are the primary source of user preference.
 * If the URL already contains DocsParams (i.e. the user arrived via a shared
 * link or manually edited the URL), the search params are also updated in-place
 * to keep the override layer consistent. Otherwise the page is simply refreshed
 * so consumers re-read the updated cookies.
 */
export function useUpdateDocsParams() {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (docsParams: DocsParams) => {
    setCookieDocsParams(document, docsParams);

    // If URL search params are present (override mode), update them to stay in sync.
    // Otherwise, just refresh the page so consumers re-read the updated cookies.
    if (parseUrlDocsParams(searchParams)) {
      const newSearchParams = new URLSearchParams(searchParams);
      setUrlDocsParams(newSearchParams, docsParams);
      router.push("?" + newSearchParams.toString());
    } else {
      router.refresh();
    }
  };
}
