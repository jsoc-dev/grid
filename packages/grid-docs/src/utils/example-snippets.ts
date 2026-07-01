import { type ExampleId, getExampleIds } from "#metadata/examples-metadata.ts";
import type { AdapterId, PluginId } from "#types/plugins.ts";
import type { ExampleSourceManifest } from "#utils/build-examples.ts";
import {
  extractSourceFilesFromManifest,
  isSpecificExampleFile,
} from "#utils/example-source-files.ts";

// Matches: // <snippet regionId> or /* <snippet regionId> or <!-- <snippet regionId>
const REGION_START_REGEX =
  /(?:\/\/|\/\*|<!--)\s*<snippet\s+([\w.-]+)>\s*(?:\*\/|-->)?$/;
// Matches: // </snippet> or /* </snippet> or <!-- </snippet>
const REGION_END_REGEX = /(?:\/\/|\/\*|<!--)\s*<\/snippet>\s*(?:\*\/|-->)?$/;

export type SnippetName = string;
export type SnippetData = {
  code: string;
  language: string;
};
export type SnippetMap = Record<SnippetName, SnippetData>;
export type SnippetMapByExampleId<
  A extends AdapterId,
  P extends PluginId<A>,
> = Record<ExampleId<A, P>, SnippetMap>;

// Matches opening <script> tags in Vue SFCs, optionally capturing lang="ts" or lang="js"
const VUE_SCRIPT_START_REGEX = /^\s*<script(?:\s[^>]*)?>$/;
const VUE_SCRIPT_LANG_REGEX = /\blang="([^"]*)"/;
// Matches </script> closing tag
const VUE_SCRIPT_END_REGEX = /^\s*<\/script>/;

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

    const sourceFiles = extractSourceFilesFromManifest(manifest);
    const relevantFiles = sourceFiles.filter((file) =>
      isSpecificExampleFile(file, exampleId as string),
    );

    for (const { code, language } of relevantFiles) {
      const lines = code.split("\n");

      let currentRegionId: string | null = null;
      let currentRegionContent: string[] = [];
      // For .vue files: track whether we're inside a <script> block and what language it uses.
      let insideScriptBlock = false;
      let scriptBlockLang: string | null = null;

      for (const line of lines) {
        // Track <script> / </script> block boundaries in .vue files.
        if (language === "vue") {
          const scriptStart = line.match(VUE_SCRIPT_START_REGEX);
          if (scriptStart) {
            insideScriptBlock = true;
            // lang="ts" → typescript, lang="js" or absent → javascript
            const langMatch = line.match(VUE_SCRIPT_LANG_REGEX);
            scriptBlockLang =
              langMatch?.[1] === "ts" ? "typescript" : "javascript";
          } else if (VUE_SCRIPT_END_REGEX.test(line)) {
            insideScriptBlock = false;
            scriptBlockLang = null;
          }
        }

        const startMatch = line.match(REGION_START_REGEX);
        if (startMatch) {
          currentRegionId = startMatch[1];
          currentRegionContent = [];
          continue;
        }

        if (currentRegionId && REGION_END_REGEX.test(line)) {
          const outdentedContent = outdent(currentRegionContent);
          // If this snippet came from inside a <script> block of a .vue file,
          // use the script block's language (ts/js) instead of "vue", since the
          // extracted code is plain TypeScript/JavaScript without SFC structure.
          const snippetLanguage =
            language === "vue" && insideScriptBlock && scriptBlockLang != null
              ? scriptBlockLang
              : language;
          // Combine lines and trim trailing whitespace, preserving indentation.
          snippets[exampleId][currentRegionId] = {
            code: outdentedContent.join("\n").replace(/\s+$/, ""),
            language: snippetLanguage,
          };
          currentRegionId = null;
          continue;
        }

        if (currentRegionId) {
          currentRegionContent.push(line);
        }
      }
    }
  }

  return snippets as SnippetMapByExampleId<A, P>;
}

export function removeSnippetMarkers(code: string): string {
  const lines = code.split("\n");
  const filtered = lines.filter(
    (line) => !REGION_START_REGEX.test(line) && !REGION_END_REGEX.test(line),
  );
  return filtered.join("\n");
}

/**
 * Removes the common leading indentation (margin) from a block of text lines.
 * This is useful for extracted code snippets, shifting them flush to the left
 * while perfectly preserving their internal relative indentation.
 */
function outdent(lines: string[]): string[] {
  let minIndent = Infinity;
  for (const line of lines) {
    if (line.trim().length > 0) {
      const match = line.match(/^(\s*)/);
      if (match) {
        minIndent = Math.min(minIndent, match[1].length);
      }
    }
  }

  if (minIndent === Infinity || minIndent === 0) {
    return lines;
  }

  return lines.map((line) =>
    line.length >= minIndent ? line.slice(minIndent) : line,
  );
}
