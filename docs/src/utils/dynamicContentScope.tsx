import "server-only";

import { AsyncLocalStorage } from "node:async_hooks";
import type { ReactNode } from "react";

export type DynamicContentScope = Record<string, unknown>;

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

export function getDynamicContentScope() {
  return dynamicContentScopeStorage.getStore() ?? null;
}
