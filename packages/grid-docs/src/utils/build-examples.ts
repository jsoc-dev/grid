import type { ExampleId } from "#metadata/examples-metadata.ts";
import type { FrameworkId, PluginId } from "#types.ts";

export type ExamplesRelativePath<F extends FrameworkId = FrameworkId> =
  F extends FrameworkId ? `examples/${F}/${PluginId<F>}` : never;

export function getExamplesRelativePath<F extends FrameworkId>(
  frameworkId: F,
  pluginId: PluginId<F>,
): ExamplesRelativePath<F> {
  return `examples/${frameworkId}/${pluginId}` as ExamplesRelativePath<F>;
}

// Returns the url of a specific example app present in the public/ folder of docs app.
export function getExampleUrl<F extends FrameworkId, P extends PluginId<F>>(
  frameworkId: F,
  pluginId: P,
  exampleId: ExampleId<F, P>,
) {
  const examplesPath = getExamplesRelativePath(frameworkId, pluginId);
  const indexFilePath = `/${examplesPath}/index.html`;

  return indexFilePath + buildExampleIdSearchQuery(exampleId);
}

// Name of the query parameter that will contain the example id.
export const EXAMPLE_ID_SEARCH_PARAM = "exampleId";

// Builds a search query that can be used to find a example by exampleId
export function buildExampleIdSearchQuery<E extends string>(exampleId: E) {
  return "?" + EXAMPLE_ID_SEARCH_PARAM + "=" + exampleId;
}
