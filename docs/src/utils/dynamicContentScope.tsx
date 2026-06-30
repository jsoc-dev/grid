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
import type { DocsParams } from "@/constants/docs";
import { getCachedExampleManifest } from "@/utils/getCachedExampleManifest";
import { getCachedSnippetMap } from "@/utils/getCachedSnippetMap";

export type DynamicContentScope<
  A extends AdapterId = AdapterId,
  P extends PluginId<A> = PluginId<A>,
> = {
  adapter: AdapterMetadata<A>;
  plugin: PluginMetadata<P>;
  snippetMap: SnippetMapByExampleId<A, P>;
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

export function createDynamicContentScope(docsParams: DocsParams) {
  // Keep token values grouped by top-level token namespace:
  // %%adapter.packageName%%, %%plugin.name%%, and similar paths.
  const adapter = getAdapterMetadata(docsParams.adapterId);
  const plugin = getPluginMetadata(docsParams.adapterId, docsParams.pluginId);

  const manifest = getCachedExampleManifest(
    docsParams.adapterId,
    docsParams.pluginId,
  );
  const snippetMap = getCachedSnippetMap(
    docsParams.adapterId,
    docsParams.pluginId,
    manifest,
  );

  return { adapter, plugin, snippetMap };
}
