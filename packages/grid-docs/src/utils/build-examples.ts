import type { ExampleId } from "#metadata/examples-metadata.ts";
import type { AdapterId, PluginId } from "#types.ts";

export type ExamplesRelativePath<A extends AdapterId = AdapterId> =
  A extends AdapterId ? `examples/${A}/${PluginId<A>}` : never;

export function getExamplesRelativePath<A extends AdapterId>(
  adapterId: A,
  pluginId: PluginId<A>,
): ExamplesRelativePath<A> {
  return `examples/${adapterId}/${pluginId}` as ExamplesRelativePath<A>;
}

// Returns the url of a specific example app present in the public/ folder of docs app.
export function getExampleUrl<A extends AdapterId, P extends PluginId<A>>(
  adapterId: A,
  pluginId: P,
  exampleId: ExampleId<A, P>,
) {
  const examplesPath = getExamplesRelativePath(adapterId, pluginId);
  const indexFilePath = `/${examplesPath}/index.html`;

  return indexFilePath + buildExampleIdSearchQuery(exampleId);
}

// Name of the query parameter that will contain the example id.
export const EXAMPLE_ID_SEARCH_PARAM = "exampleId";

// Builds a search query that can be used to find a example by exampleId
export function buildExampleIdSearchQuery<E extends string>(exampleId: E) {
  return "?" + EXAMPLE_ID_SEARCH_PARAM + "=" + exampleId;
}

/** A map of keys as file paths and value as file contents. */
export type ExampleSourceManifest = Record<string, string>;

/** The filename of the source code manifest. */
export const EXAMPLE_SOURCE_MANIFEST_FILE_NAME = "source-manifest.json";

/** Returns the url of the source code manifest for the given plugin. */
export function getExampleSourceManifestUrl<A extends AdapterId>(
  adapterId: A,
  pluginId: PluginId<A>,
) {
  const examplesPath = getExamplesRelativePath(adapterId, pluginId);
  return `/${examplesPath}/${EXAMPLE_SOURCE_MANIFEST_FILE_NAME}`;
}
