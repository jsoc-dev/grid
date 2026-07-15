"use client";

import { getPluginIcon } from "@/icons/plugins";
import CardGrid from "@/components/CardGrid";
import { useExamplesNavigator } from "@/hooks/useExamplesNavigator";
import {
  getExampleIds,
  getExampleMetadata,
  type AdapterId,
  type PluginId,
} from "@jsoc/grid-docs";

type Props<A extends AdapterId> = {
  adapterId: A;
  pluginId: PluginId<A>;
};

export function ChooseExample<A extends AdapterId>({
  adapterId,
  pluginId,
}: Props<A>) {
  const navigateToExample = useExamplesNavigator();
  const exampleIds = getExampleIds(adapterId, pluginId);

  return (
    <div className="flex flex-col py-6 gap-6 w-full items-center">
      <h1 className="text-2xl font-semibold">Choose an example</h1>
      <CardGrid
        cards={exampleIds.map((exampleId) => {
          const exampleMetadata = getExampleMetadata(
            adapterId,
            pluginId,
            exampleId,
          );
          const PluginIcon = getPluginIcon(adapterId, pluginId);

          return {
            id: exampleId,
            label: exampleMetadata.name,
            icon: <PluginIcon className="w-12 h-12" />,
            onClick: () => navigateToExample([adapterId, pluginId, exampleId]),
          };
        })}
      />
    </div>
  );
}
