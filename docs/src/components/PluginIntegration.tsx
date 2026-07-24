import { getAdapterIntegrationItem, GRID_CORE_INTEGRATION_ITEM } from "@/components/FrameworkIntegration";
import { Integration, type IntegrationItem } from "@/components/Integration";
import { getPluginIcon } from "@/icons/plugins";
import {
  getPluginMetadata,
  type AdapterId,
  type PluginId,
} from "@jsoc/grid-docs";

type Props<A extends AdapterId> = {
  adapterId: A;
  pluginId: PluginId<A>;
};

function getPluginIntegrationItem<A extends AdapterId>(
  adapterId: A,
  pluginId: PluginId<A>
): IntegrationItem {
  const PluginIcon = getPluginIcon(adapterId, pluginId);
  const { name } = getPluginMetadata(adapterId, pluginId);
  return {
    Icon: PluginIcon,
    iconProps: { className: "p-1.5" },
    label: name,
  };
}

export function PluginIntegration<A extends AdapterId>({
  adapterId,
  pluginId,
}: Props<A>) {
  return (
    <Integration
      items={[
        GRID_CORE_INTEGRATION_ITEM,
        getAdapterIntegrationItem(adapterId),
        getPluginIntegrationItem(adapterId, pluginId),
      ]}
    />
  );
}
