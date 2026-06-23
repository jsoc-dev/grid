"use client";

import { ADAPTER_ID_PARAM_KEY, PLUGIN_ID_PARAM_KEY } from "@/constants/docs";
import { useDocsParams } from "@/hooks/useDocsParams";
import type { AdapterId, PluginId } from "@jsoc/grid-docs";
import type { ReactNode } from "react";

type Props = {
  adapterId: AdapterId;
  pluginId?: PluginId<AdapterId>;
  children: ReactNode;
};

export function If({ adapterId, pluginId, children }: Props) {
  const docsParams = useDocsParams();

  if (
    docsParams[ADAPTER_ID_PARAM_KEY] === adapterId &&
    (pluginId === undefined || pluginId === docsParams[PLUGIN_ID_PARAM_KEY])
  ) {
    return children;
  }

  return null;
}
