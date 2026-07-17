"use client";

import { useDocsParams } from "@/hooks/useDocsParams";
import type { AdapterId, PluginId } from "@jsoc/grid-docs";
import { ensureArray } from "@jsoc/utils";
import type { ReactNode } from "react";

type Props = {
  adapterId?: AdapterId | AdapterId[];
  pluginId?: PluginId<AdapterId> | PluginId<AdapterId>[];
  children: ReactNode;
};

export function If({ children, adapterId, pluginId }: Props) {
  const { adapterId: currentAdapterId, pluginId: currentPluginId } =
    useDocsParams();

  const isAdapterMatch =
    !adapterId || ensureArray(adapterId).includes(currentAdapterId);
  const isPluginMatch =
    !pluginId || ensureArray(pluginId).includes(currentPluginId);

  if (isAdapterMatch && isPluginMatch) {
    return children;
  }

  return null;
}
