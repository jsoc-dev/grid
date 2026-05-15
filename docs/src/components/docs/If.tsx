"use client";

import { useRootContext } from "@/contexts/RootContext";
import type { PluginId } from "@jsoc/grid-docs";
import type { ReactNode } from "react";

type PluginIdCondition = {
  [pluginId in PluginId<"react-grid">]: boolean;
};

type Props = PluginIdCondition & {
  children: ReactNode;
};

export function If({ children, ...pluginIds }: Props) {
  const { selectedPluginId } = useRootContext();

  for (const [pluginId, show] of Object.entries(pluginIds)) {
    if (show && pluginId === selectedPluginId) {
      return children;
    }
  }

  return null;
}
