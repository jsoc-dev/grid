"use client";

import { ADAPTER_ID_PARAM_KEY, PLUGIN_ID_PARAM_KEY } from "@/constants/docs";
import { useDocsParams } from "@/hooks/useDocsParams";
import { getPluginMetadata, type PluginMetadata } from "@jsoc/grid-docs";

type Props = {
  metaKey: keyof PluginMetadata;
};

export function PluginMeta({ metaKey }: Props) {
  const docsParams = useDocsParams();
  const pluginMetadata = getPluginMetadata(
    docsParams[ADAPTER_ID_PARAM_KEY],
    docsParams[PLUGIN_ID_PARAM_KEY],
  );
  return pluginMetadata[metaKey];
}
