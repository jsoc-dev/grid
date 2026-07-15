"use client";

import { Switch } from "@/components/Switch";
import { usePlaygroundContext } from "@/components/playground/PlaygroundContext";
import {
  type AdapterId,
  type PluginMetadata,
  type PluginId,
} from "@jsoc/grid-docs";
import { getPluginIcon } from "@/icons/plugins";

type Props<A extends AdapterId> = {
  adapterId: A;
  pluginId: PluginId<A>;
  meta: PluginMetadata;
};

export function SwitchPlugin<A extends AdapterId>({
  adapterId,
  pluginId,
  meta,
}: Props<A>) {
  const { selectedPluginId, setSelectedPluginId } = usePlaygroundContext();
  const { shortName } = meta;
  const Icon = getPluginIcon(adapterId, pluginId);
  const isSelected = pluginId === selectedPluginId;

  return (
    <Switch
      icon={Icon}
      label={shortName}
      isSelected={isSelected}
      onClick={() => setSelectedPluginId(pluginId)}
    />
  );
}
