import { getDynamicContentScope } from "@/utils/dynamicContentScope";
import { CodeBlock } from "./CodeBlock";
import type {
  AdapterId,
  ExampleId,
  PluginId,
  SnippetId,
} from "@jsoc/grid-docs";

type SnippetProps<A extends AdapterId, P extends PluginId<A>> = {
  exampleId: ExampleId<A, P>;
  snippetId: SnippetId;
};

export function Snippet<A extends AdapterId, P extends PluginId<A>>({
  exampleId,
  snippetId,
}: SnippetProps<A, P>) {
  const scope = getDynamicContentScope<A, P>()!;

  const snippets = scope.snippetMap[exampleId];
  const snippet = snippets?.[snippetId];

  if (!snippet) return <CodeBlock code="" lang="plaintext" />;
  return <CodeBlock code={snippet.code} lang={snippet.language} />;
}
