import { type AdapterId } from "@jsoc/grid-docs";
import { PluginCards } from "@/components/PluginCards";
import { ExamplePageLayout } from "./ExamplePageLayout";

type Props<A extends AdapterId> = {
  adapterId: A;
};

export function ChoosePlugin<A extends AdapterId>({ adapterId }: Props<A>) {
  return (
    <ExamplePageLayout title="Choose your UI component">
      <PluginCards
        adapterId={adapterId}
        hideMetadata
        mainLink={(pluginId) => `/examples/${adapterId}/${pluginId}`}
      />
    </ExamplePageLayout>
  );
}
