import { getDynamicContentScope } from "@/utils/dynamicContentScope";
import type { AdapterId, PluginId } from "@jsoc/grid-docs";
import { ensureArray } from "@jsoc/utils";
import type { ReactNode } from "react";

type Props = {
  adapterId?: AdapterId | AdapterId[];
  pluginId?: PluginId<AdapterId> | PluginId<AdapterId>[];
  children: ReactNode;
};

export function If({ children, adapterId, pluginId }: Props) {
  const { adapter, plugin } = getDynamicContentScope()!;

  const isAdapterMatch =
    !adapterId || ensureArray(adapterId).includes(adapter.id);
  const isPluginMatch = !pluginId || ensureArray(pluginId).includes(plugin.id);

  if (isAdapterMatch && isPluginMatch) {
    return children;
  }

  return null;
}
