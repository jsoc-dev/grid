import type { ExampleId } from "#metadata/examples-metadata.ts";
import type { AdapterId, PluginId } from "#types/plugins.ts";
import type { CodeLanguage } from "#utils/example-source-code.ts";

export type SnippetId = string;
export type SnippetData = {
  code: string;
  language: CodeLanguage;
};
export type SnippetMap = Record<SnippetId, SnippetData>;
export type SnippetMapByExampleId<
  A extends AdapterId,
  P extends PluginId<A>,
> = Record<ExampleId<A, P>, SnippetMap>;
