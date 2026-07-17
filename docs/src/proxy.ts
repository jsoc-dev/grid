import {
  parseUrlDocsParams,
  resolveDocsParams,
  setCookieDocsParams,
  setUrlDocsParams,
} from "@/utils/docsParams";
import { shallowEqual } from "@jsoc/utils";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: ["/docs/:path*"],
};

/**
 * Dedicated proxy for docs pages to update cookies and url search params with latest docs params.
 *
 * PROXY FLOW:
 *
 * -           Request arrives (for a page inside /docs/*)
 * -               │
 * -               ▼
 * -            proxy.ts
 * - ┌─────────────────────────────────────────────┐
 * -        1. Parse URL params (could be partial)
 * -        2. Resolve full params (URL + cookies).
 * -        3. If URL ≠ resolved → redirect.
 * -        4. Always set cookies on the response.
 * - └─────────────────────────────────────────────┘
 * -                │
 * -                ▼  (URL is now guaranteed to have complete params)
 * -                │
 * -                ├──► createDynamicContentScope → resolveDocsParams(searchParams) ✅ whole docsParams available without passing cookies
 * -                │
 * -                └──► useDocsParams             → resolveDocsParams(searchParams) ✅ whole docsParams available without passing cookies
 * -
 */
export function proxy(request: NextRequest) {
  const { nextUrl: url, cookies } = request;
  const currentDocsParams = parseUrlDocsParams(url.searchParams);
  const resolvedDocsParams = resolveDocsParams(url.searchParams, cookies);
  const isUpdateNeeded = !shallowEqual(currentDocsParams, resolvedDocsParams);

  let response: NextResponse;
  if (isUpdateNeeded) {
    const urlClone = url.clone();
    setUrlDocsParams(urlClone.searchParams, resolvedDocsParams);
    // TODO: fix issues below:
    // 1. url hashs are lost due to redirect
    // 2. clicking on same page links that contain partial docsparams and hash fragment doesn't change scroll position (as redirect is performed)
    //    whereas clicking on headings still works fine (since they don't contain docsparams and no redirect is performed).
    response = NextResponse.redirect(urlClone);
  } else {
    response = NextResponse.next();
  }

  // always update cookies so that the user preferred DocsParams persists while navigating across pages
  setCookieDocsParams(response, resolvedDocsParams);

  return response;
}
