"use client";

import {
  getPluginIds,
  getPluginMetadata,
  type AdapterId,
} from "@jsoc/grid-docs";
import CardGrid from "@/components/generic/CardGrid";
import { useExamplesNavigator } from "@/hooks/useExamplesNavigator";
import { getPluginIcon } from "@/assets/icons/plugins";

type Props<A extends AdapterId> = {
  adapterId: A;
};

export function ChoosePlugin<A extends AdapterId>({ adapterId }: Props<A>) {
  const navigateToExample = useExamplesNavigator();
  const pluginIds = getPluginIds(adapterId);

  return (
    <div className="flex flex-col py-6 gap-6 w-full items-center">
      <h1 className="text-2xl font-semibold">Choose a plugin</h1>
      <CardGrid
        cards={pluginIds.map((pluginId) => {
          const { name } = getPluginMetadata(adapterId, pluginId);
          const PluginIcon = getPluginIcon(adapterId, pluginId);

          return {
            id: pluginId,
            label: name,
            icon: <PluginIcon className="w-12 h-12" />,
            onClick: () => navigateToExample([adapterId, pluginId]),
          };
        })}
      />
    </div>
  );
}
