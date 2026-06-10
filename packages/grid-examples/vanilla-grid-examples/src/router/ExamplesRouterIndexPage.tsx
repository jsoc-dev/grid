import type { ExamplesRouterOptions } from "#router/types.ts";

import {
  buildExampleIdSearchQuery,
  type ExampleId,
  getExampleIds,
  getExampleMetadata,
  getPluginMetadata,
  type PluginId,
  type VanillaGridPluginId,
} from "@jsoc/grid-docs";
import { setExampleIdSearchParam } from "@jsoc/grid-examples-core";

export function ExamplesRouterIndexPage<P extends VanillaGridPluginId>(
  options: ExamplesRouterOptions<P>,
) {
  const { pluginId } = options;
  const { name } = getPluginMetadata("vanilla-grid", pluginId);
  const exampleIds = getExampleIds("vanilla-grid", pluginId);

  return (
    <nav>
      <h1>{name} x JSOC Grid</h1>
      <ul>
        {exampleIds.map((exampleId) => (
          <ExampleLink
            key={exampleId}
            pluginId={pluginId}
            exampleId={exampleId}
          />
        ))}
      </ul>
    </nav>
  ) as HTMLElement;
}

type ExampleLinkProps<P extends PluginId<"vanilla-grid">> = {
  pluginId: P;
  exampleId: ExampleId<"vanilla-grid", P>;
};

function ExampleLink<P extends PluginId<"vanilla-grid">>({
  pluginId,
  exampleId,
}: ExampleLinkProps<P>) {
  const { name: exampleName } = getExampleMetadata(
    "vanilla-grid",
    pluginId,
    exampleId,
  );

  return (
    <li>
      <a
        href={buildExampleIdSearchQuery(exampleId)}
        onClick={(event: Event) => {
          event.preventDefault();
          setExampleIdSearchParam(exampleId);
        }}
      >
        {exampleName}
      </a>
    </li>
  ) as HTMLElement;
}
