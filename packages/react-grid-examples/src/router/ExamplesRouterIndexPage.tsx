import type { ExamplesRouterOptions } from "#router/types.ts";

import {
  buildExampleIdSearchQuery,
  getExampleIds,
  getExampleMetadata,
  getPluginMetadata,
  type ReactGridPluginId,
} from "@jsoc/grid-docs";
import { Link } from "react-router-dom";

export function ExamplesRouterIndexPage({
  pluginId,
}: ExamplesRouterOptions<ReactGridPluginId>) {
  const { name } = getPluginMetadata("react-grid", pluginId);
  const exampleIds = getExampleIds("react-grid", pluginId);

  return (
    <nav>
      <h1>{name} x JSOC Grid</h1>
      <ul>
        {exampleIds.map((exampleId) => {
          const { name } = getExampleMetadata(
            "react-grid",
            pluginId,
            exampleId,
          );
          return (
            <li key={exampleId}>
              <Link to={buildExampleIdSearchQuery(exampleId)}>{name}</Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
