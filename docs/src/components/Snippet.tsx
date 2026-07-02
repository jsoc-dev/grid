import { getDynamicContentScope } from "@/utils/dynamicContentScope";
import { CodeBlock } from "./CodeBlock";
import type {
  AdapterId,
  ExampleId,
  PluginId,
  SnippetName,
} from "@jsoc/grid-docs";

export function Snippet<A extends AdapterId, P extends PluginId<A>>({
  exampleId,
  name,
}: {
  exampleId: ExampleId<A, P>;
  name: SnippetName;
}) {
  const scope = getDynamicContentScope<A, P>()!;

  const snippets = scope.snippetMap[exampleId];
  const snippet = snippets?.[name];

  if (!snippet) return <CodeBlock code="" lang="plaintext" />;
  return <CodeBlock code={snippet.code} lang={snippet.language} />;
}
