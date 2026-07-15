"use client";

import { Switch } from "@/components/Switch";
import { getAdapterIcon } from "@/assets/icons/adapters";
import {
  getAdapterMetadata,
  getPluginIds,
  type AdapterId,
} from "@jsoc/grid-docs";
import { usePlaygroundContext } from "@/components/playground/PlaygroundContext";

type Props = {
  adapterId: AdapterId;
};

export function SwitchAdapter({ adapterId }: Props) {
  const {
    selectedAdapterId,
    selectedPluginId,
    setSelectedAdapterId,
    setSelectedPluginId,
  } = usePlaygroundContext();

  const adapterMetadata = getAdapterMetadata(adapterId);
  const Icon = getAdapterIcon(adapterId);
  const isSelected = adapterId === selectedAdapterId;

  return (
    <Switch
      icon={Icon}
      label={adapterMetadata.frameworkName}
      isSelected={isSelected}
      onClick={() => {
        const plugins = getPluginIds(adapterId);
        const pluginId =
          plugins.find((id) => id === selectedPluginId) ?? plugins[0];
        setSelectedAdapterId(adapterId);
        setSelectedPluginId(pluginId);
      }}
    />
  );
}
