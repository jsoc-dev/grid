import "server-only";

import { AsyncLocalStorage } from "node:async_hooks";
import { type ReactNode } from "react";
import {
  getAdapterMetadata,
  getPluginMetadata,
  type AdapterId,
  type AdapterMetadata,
  type PluginId,
  type PluginMetadata,
  type SnippetMapByExampleId,
} from "@jsoc/grid-docs";
import { getExampleManifest } from "@/artifacts/get-example-manifest";
import { getCachedSnippetMap } from "@/utils/getCachedSnippetMap";
import { hasDynamicContentTokens } from "@/utils/dynamicContent";
import { resolveDocsParams } from "@/utils/docsParams";
import { cookies } from "next/headers";

export type DynamicContentScope<
  A extends AdapterId = AdapterId,
  P extends PluginId<A> = PluginId<A>,
> = {
  adapter: AdapterMetadata<A>;
  plugin: PluginMetadata<P>;
  snippetMap: SnippetMapByExampleId<A, P>;
  hasDynamicContent: boolean;
};

const dynamicContentScopeStorage = new AsyncLocalStorage<DynamicContentScope>();

/**
 * Stores dynamic MDX replacement data for the current server render.
 *
 * MDX components are created by Nextra, so the docs route cannot pass custom
 * props directly to every generated element. AsyncLocalStorage gives wrapped
 * MDX components access to the route-derived scope without introducing a React
 * context or converting the MDX component map into client code.
 */
export function DynamicContentScopeBoundary({
  scope,
  children,
}: {
  scope: DynamicContentScope;
  children: ReactNode;
}) {
  dynamicContentScopeStorage.enterWith(scope);
  return <>{children}</>;
}

export function getDynamicContentScope<
  A extends AdapterId = AdapterId,
  P extends PluginId<A> = PluginId<A>,
>() {
  return dynamicContentScopeStorage.getStore() as
    | DynamicContentScope<A, P>
    | undefined;
}

export async function createDynamicContentScope(
  sourceCode: string,
  pageProps: PageProps<"/docs/[[...mdxPath]]">,
): Promise<DynamicContentScope> {
  const searchParams = await pageProps.searchParams;
  const docsParams = resolveDocsParams(searchParams, await cookies());
  const adapter = getAdapterMetadata(docsParams.adapterId);
  const plugin = getPluginMetadata(docsParams.adapterId, docsParams.pluginId);

  const manifest = getExampleManifest(
    docsParams.adapterId,
    docsParams.pluginId,
  );
  const snippetMap = getCachedSnippetMap(
    docsParams.adapterId,
    docsParams.pluginId,
    manifest,
  );

  const hasDynamicContent = hasDynamicContentTokens(sourceCode);

  return { adapter, plugin, snippetMap, hasDynamicContent };
}
