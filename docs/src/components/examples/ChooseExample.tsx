import { getPluginIcon } from "@/icons/plugins";
import { Cards } from "@/components/Cards";
import { ExamplePageLayout } from "./ExamplePageLayout";
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
  const exampleIds = getExampleIds(adapterId, pluginId);

  return (
    <ExamplePageLayout title="Choose an example">
      <Cards centered>
        {exampleIds.map((exampleId) => {
          const exampleMetadata = getExampleMetadata(
            adapterId,
            pluginId,
            exampleId,
          );
          const PluginIcon = getPluginIcon(adapterId, pluginId);

          return (
            <Cards.Card
              key={exampleId}
              title={exampleMetadata.name}
              icon={<PluginIcon className="w-12 h-12" />}
              mainLink={`/examples/${adapterId}/${pluginId}/${exampleId}`}
            />
          );
        })}
      </Cards>
    </ExamplePageLayout>
  );
}
