"use client";

import { useDocsParams } from "@/hooks/useDocsParams";
import type { AdapterId, PluginId } from "@jsoc/grid-docs";
import type { ReactNode } from "react";

type Props = {
  adapterId: AdapterId;
  pluginId?: PluginId<AdapterId>;
  children: ReactNode;
};

export function If({ adapterId, pluginId, children }: Props) {
  const { adapterId: currentAdapterId, pluginId: currentPluginId } =
    useDocsParams();

  if (
    adapterId === currentAdapterId &&
    (pluginId === undefined || pluginId === currentPluginId)
  ) {
    return children;
  }

  return null;
}
