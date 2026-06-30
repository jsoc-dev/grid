import type { ExampleId } from "#metadata/examples-metadata.ts";
import type { AdapterId, PluginId } from "#types/plugins.ts";

export type ExamplesRelativePath<A extends AdapterId = AdapterId> =
  A extends AdapterId ? `examples/${A}/${PluginId<A>}` : never;

/**
 * Returns the relative path of the examples directory for the given adapter and plugin.
 * This is a mutual contract between build-examples script and example app url getters to follow this url pattern.
 */
export function getExamplesRelativePath<A extends AdapterId>(
  adapterId: A,
  pluginId: PluginId<A>,
): ExamplesRelativePath<A> {
  return `examples/${adapterId}/${pluginId}` as ExamplesRelativePath<A>;
}

/** Returns the github url of the example app for the given adapter and plugin. */
export function getExampleAppGitHubUrl<
  A extends AdapterId,
  P extends PluginId<A>,
>(adapterId: A, pluginId: P) {
  const repo = "https://github.com/jsoc-dev/grid/tree/main";
  const examplesPath = getExamplesRelativePath(adapterId, pluginId);
  return `${repo}/${examplesPath}`;
}

/** Returns the url of a specific example html file present in the public/ folder of docs. */
export function getExampleHtmlFileUrl<
  A extends AdapterId,
  P extends PluginId<A>,
>(adapterId: A, pluginId: P) {
  const examplesPath = getExamplesRelativePath(adapterId, pluginId);
  return `/${examplesPath}/index.html`;
}

/** Returns the url of a specific example html file present in the public/ folder of docs app along with exampleId as search param. */
export function getExampleUrl<A extends AdapterId, P extends PluginId<A>>(
  adapterId: A,
  pluginId: P,
  exampleId: ExampleId<A, P>,
) {
  const indexFilePath = getExampleHtmlFileUrl(adapterId, pluginId);

  return indexFilePath + buildExampleIdSearchQuery(exampleId);
}

/** Name of the query parameter that will contain the example id. */
export const EXAMPLE_ID_SEARCH_PARAM = "exampleId";

/** Builds a search query that can be used to find a example by exampleId */
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
