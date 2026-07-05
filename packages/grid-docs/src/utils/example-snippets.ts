import { getExampleIds } from "#metadata/examples-metadata.ts";
import type { SnippetMapByExampleId } from "#types/example-snippets.ts";
import type { ExampleSourceFile } from "#types/example-source-files.ts";
import type { AdapterId, PluginId } from "#types/plugins.ts";
import type { ExampleSourceManifest } from "#utils/build-examples.ts";
import type { CodeLanguage } from "#utils/example-source-code.ts";
import { isSpecificExampleFile } from "#utils/example-source-files.ts";
import { outdentLines } from "#utils/outdentLines.ts";
import { extractScriptsFromVueSfc } from "#utils/vue-sfc.ts";

// Matches: // <snippet snippetId> or /* <snippet snippetId> or <!-- <snippet snippetId>
const SNIPPET_START_REGEX =
  /(?:\/\/|\/\*|<!--)\s*<snippet\s+([\w.-]+)>\s*(?:\*\/|-->)?$/;
// Matches: // </snippet> or /* </snippet> or <!-- </snippet>
const SNIPPET_END_REGEX = /(?:\/\/|\/\*|<!--)\s*<\/snippet>\s*(?:\*\/|-->)?$/;

export function removeSnippetMarkers(code: string): string {
  const lines = code.split("\n");
  const filtered = lines.filter(
    (line) => !SNIPPET_START_REGEX.test(line) && !SNIPPET_END_REGEX.test(line),
  );
  return filtered.join("\n");
}

export function extractSnippetsFromManifest<
  A extends AdapterId,
  P extends PluginId<A>,
>(
  adapterId: A,
  pluginId: P,
  manifest: ExampleSourceManifest,
): SnippetMapByExampleId<A, P> {
  const snippets = {} as Partial<SnippetMapByExampleId<A, P>>;

  const exampleIds = getExampleIds(adapterId, pluginId);

  for (const exampleId of exampleIds) {
    snippets[exampleId] = {};

    const sourceFiles = Object.values(manifest);
    const relevantFiles = sourceFiles.filter((file) =>
      isSpecificExampleFile(file, exampleId as string),
    );

    for (const file of relevantFiles) {
      const lines = file.code.split("\n");
      let currentSnippetId: string | null = null;
      let currentSnippetLines: string[] = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        const snippetStartMatch = line.match(SNIPPET_START_REGEX);
        const snippetEndTest = SNIPPET_END_REGEX.test(line);

        if (snippetStartMatch) {
          currentSnippetId = snippetStartMatch[1];
          currentSnippetLines = [];
          continue;
        }

        if (snippetEndTest && currentSnippetId) {
          const code = joinSnippetLines(currentSnippetLines);
          const language = resolveSnippetLanguage(file, i);

          snippets[exampleId][currentSnippetId] = { code, language };

          currentSnippetId = null;
          continue;
        }

        if (currentSnippetId) currentSnippetLines.push(line);
      }
    }
  }

  return snippets as SnippetMapByExampleId<A, P>;
}

function joinSnippetLines(lines: string[]): string {
  return outdentLines(lines).join("\n").replace(/\s+$/, "");
}

function resolveSnippetLanguage(
  file: ExampleSourceFile,
  snippetLineNum: number,
): CodeLanguage {
  let lang = file.language;

  if (lang === "vue") {
    const vueScripts = extractScriptsFromVueSfc(file.code);
    const enclosingScript = vueScripts.find(
      (s) => snippetLineNum >= s.startLine && snippetLineNum <= s.endLine,
    );
    // If this snippet came from inside a <script> block of a .vue file,
    // use the script block's language (ts/js) instead of "vue", since the
    // extracted code is plain TypeScript/JavaScript without SFC structure.
    if (enclosingScript) lang = enclosingScript.lang;
  }

  return lang;
}
