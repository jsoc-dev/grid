"use client";

import { getPluginIds, getPluginMetadata } from "@jsoc/grid-docs";
import { type FrameworkId } from "@jsoc/grid-docs";
import CardGrid from "@/components/generic/CardGrid";
import { useExamplesNavigator } from "@/hooks/useExamplesNavigator";
import { getPluginIcon } from "@/assets/icons/plugins";

type Props<F extends FrameworkId> = {
  frameworkId: F;
};

export function ChoosePlugin<F extends FrameworkId>({ frameworkId }: Props<F>) {
  const navigateToExample = useExamplesNavigator();
  const pluginIds = getPluginIds(frameworkId);

  return (
    <div className="flex flex-col py-6 gap-6 w-full items-center">
      <h1 className="text-2xl font-semibold">Choose a plugin</h1>
      <CardGrid
        cards={pluginIds.map((pluginId) => {
          const { name } = getPluginMetadata(frameworkId, pluginId);
          const PluginIcon = getPluginIcon(frameworkId, pluginId);

          return {
            id: pluginId,
            label: name,
            icon: <PluginIcon className="w-12 h-12" />,
            onClick: () => navigateToExample([frameworkId, pluginId]),
          };
        })}
      />
    </div>
  );
}
