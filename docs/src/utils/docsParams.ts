import type { PageSearchParams } from "@/types/next";
import { parseCookie, stringifySetCookie } from "cookie";
import {
  getPluginIds,
  isValidAdapterId,
  isValidPluginId,
  type AdapterId,
  type PluginId,
} from "@jsoc/grid-docs";
import { isString } from "@jsoc/utils";
import type { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import type { NextResponse } from "next/server";

type SearchParams = URLSearchParams | PageSearchParams;
type Cookies = Document["cookie"] | ReadonlyRequestCookies | RequestCookies;

export type DocsParams = {
  adapterId: AdapterId;
  pluginId: PluginId<AdapterId>;
};
export type PartialDocsParams = Omit<DocsParams, "pluginId">;
export type DocsParamsKey = keyof DocsParams;

const DEFAULT_ADAPTER_ID = "react-grid" satisfies AdapterId;

export function getDefaultPluginId<A extends AdapterId>(
  adapterId: A,
): PluginId<A> {
  return getPluginIds(adapterId)[0];
}

export function createDocsParams(
  adapterId: string | undefined,
  pluginId: string | undefined,
): PartialDocsParams | DocsParams | undefined {
  if (!adapterId || !isValidAdapterId(adapterId)) return undefined;
  if (!pluginId || !isValidPluginId(adapterId, pluginId)) return { adapterId };
  return { adapterId, pluginId };
}

export function parseUrlDocsParams(params: SearchParams) {
  const getParam = (key: DocsParamsKey) => {
    const value =
      params instanceof URLSearchParams ? params.getAll(key) : params[key];

    return Array.isArray(value) ? value[0] : value;
  };

  const adapterIdParam = getParam("adapterId");
  const pluginIdParam = getParam("pluginId");

  return createDocsParams(adapterIdParam, pluginIdParam);
}

export function parseCookieDocsParams(cookies: Cookies) {
  const getCookie = (name: DocsParamsKey) =>
    isString(cookies) ? parseCookie(cookies)[name] : cookies.get(name)?.value;

  const adapterIdCookie = getCookie("adapterId");
  const pluginIdCookie = getCookie("pluginId");

  return createDocsParams(adapterIdCookie, pluginIdCookie);
}

/**
 * Resolves full docs params from url search params and cookies
 * @param params url search params
 * @param cookies optional cookies to use for fallback values
 */
export function resolveDocsParams(
  params: SearchParams,
  cookies?: Cookies,
): DocsParams {
  const urlDocsParams = parseUrlDocsParams(params);
  const cookieDocsParams = parseCookieDocsParams(cookies || "");

  if (urlDocsParams) {
    if ("pluginId" in urlDocsParams) return urlDocsParams;

    const adapterId = urlDocsParams.adapterId;
    const pluginId =
      cookieDocsParams &&
      "pluginId" in cookieDocsParams &&
      isValidPluginId(adapterId, cookieDocsParams.pluginId)
        ? cookieDocsParams.pluginId
        : getDefaultPluginId(adapterId);

    return { adapterId, pluginId };
  }

  if (cookieDocsParams) {
    if ("pluginId" in cookieDocsParams) return cookieDocsParams;

    const adapterId = cookieDocsParams.adapterId;
    const pluginId = getDefaultPluginId(adapterId);

    return { adapterId, pluginId };
  }

  return {
    adapterId: DEFAULT_ADAPTER_ID,
    pluginId: getDefaultPluginId(DEFAULT_ADAPTER_ID),
  };
}

export function setUrlDocsParams(
  searchParams: URLSearchParams,
  docsParams: DocsParams | PartialDocsParams,
) {
  for (const key in docsParams) {
    const value = docsParams[key as keyof typeof docsParams];
    searchParams.set(key, value);
  }
}

export function setCookieDocsParams(
  cookieTarget: Document | NextResponse,
  docsParams: DocsParams | PartialDocsParams,
) {
  for (const key in docsParams) {
    const value = docsParams[key as keyof typeof docsParams];
    const options = { name: key, value, path: "/", maxAge: 31536000 };

    // NOTE: we are not using `instanceof Document` because it will crash in proxy
    // which runs in edge runtime where global Document constructor doesnt exist
    if ("cookies" in cookieTarget) {
      cookieTarget.cookies.set(options);
    } else {
      cookieTarget.cookie = stringifySetCookie(options);
    }
  }
}
