"use client";

import { getPluginIcon } from "@/assets/icons/plugins";
import CardGrid from "@/components/generic/CardGrid";
import { useExamplesNavigator } from "@/hooks/useExamplesNavigator";
import {
  getExampleIds,
  getExampleMetadata,
  type FrameworkId,
  type PluginId,
} from "@jsoc/grid-docs";

type Props<F extends FrameworkId> = {
  frameworkId: F;
  pluginId: PluginId<F>;
};

export function ChooseExample<F extends FrameworkId>({
  frameworkId,
  pluginId,
}: Props<F>) {
  const navigateToExample = useExamplesNavigator();
  const exampleIds = getExampleIds(frameworkId, pluginId);

  return (
    <div className="flex flex-col py-6 gap-6 w-full items-center">
      <h1 className="text-2xl font-semibold">Choose an example</h1>
      <CardGrid
        cards={exampleIds.map((exampleId) => {
          const exampleMetadata = getExampleMetadata(
            frameworkId,
            pluginId,
            exampleId,
          );
          const PluginIcon = getPluginIcon(frameworkId, pluginId);

          return {
            id: exampleId,
            label: exampleMetadata.name,
            icon: <PluginIcon className="w-12 h-12" />,
            onClick: () =>
              navigateToExample([frameworkId, pluginId, exampleId]),
          };
        })}
      />
    </div>
  );
}
