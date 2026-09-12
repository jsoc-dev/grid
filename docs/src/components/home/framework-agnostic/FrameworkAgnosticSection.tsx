import "server-only";

import { getExampleManifest } from "@/artifacts/get-example-manifest";
import { FrameworkInteractiveShowcase } from "@/components/home/framework-agnostic/FrameworkInteractiveShowcase";
import type { CodeLanguage, ExampleSourceManifest } from "@jsoc/grid-docs";
import { extractSnippetsFromManifest } from "@jsoc/grid-docs";
import { isSpecificExampleFile } from "@jsoc/grid-docs";
import type { FrameworkSnippetData } from "@/components/home/framework-agnostic/FrameworkCodePreview";
import type { FrameworkFlowAdapterId } from "@/components/home/framework-agnostic/FrameworkFlowDiagram";

export function FrameworkAgnosticSection() {
  const snippets: Record<FrameworkFlowAdapterId, FrameworkSnippetData> = {
    "react-grid": getFrameworkSnippet("react-grid"),
    "vue-grid": getFrameworkSnippet("vue-grid"),
    "vanilla-grid": getFrameworkSnippet("vanilla-grid"),
  };

  return (
    <section className="space-y-8 border-t border-neutral-200 pt-16 dark:border-neutral-800">
      <div className="max-w-2xl space-y-3">
        <div className="text-xs font-semibold uppercase tracking-wider text-accent-600 dark:text-accent-400">
          Framework Agnostic
        </div>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          One engine. Every framework.
        </h2>
        <p className="leading-relaxed text-neutral-600 dark:text-neutral-400">
          The Core Engine generates framework-agnostic schema from unknown JSON.
          Framework adapters expose it natively — hooks for React, composables
          for Vue, utilities for Vanilla JS. Here shown powering AG Grid across
          all three:
        </p>
      </div>

      <FrameworkInteractiveShowcase snippets={snippets} />
    </section>
  );
}

const typeScriptManifestCache = new Map<
  FrameworkFlowAdapterId,
  ExampleSourceManifest
>();

// Prefer TypeScript variants: the manifest holds both Basic.ts and Basic.js, and
// snippet extraction lets the later file win — drop the JavaScript twin so the
// showcase consistently shows typed code. Memoized per adapter (module scope).
function getTypeScriptManifest(
  adapterId: FrameworkFlowAdapterId,
): ExampleSourceManifest {
  const cached = typeScriptManifestCache.get(adapterId);
  if (cached) return cached;

  const manifest = getExampleManifest(adapterId, "ag");
  const paths = new Set(Object.keys(manifest));
  const filtered: ExampleSourceManifest = Object.fromEntries(
    Object.entries(manifest).filter(([path]) => {
      const tsTwin = path.replace(/\.jsx$/, ".tsx").replace(/\.js$/, ".ts");
      return tsTwin === path || !paths.has(tsTwin);
    }),
  );
  typeScriptManifestCache.set(adapterId, filtered);
  return filtered;
}

function getFrameworkSnippet(
  adapterId: FrameworkFlowAdapterId,
): FrameworkSnippetData {
  const manifest = getTypeScriptManifest(adapterId);
  const snippetMap = extractSnippetsFromManifest(adapterId, "ag", manifest);
  const basicSnippets = snippetMap.basic;

  const importCode = basicSnippets?.import?.code ?? "";
  const createCode = basicSnippets?.create?.code ?? "";
  const renderCode = basicSnippets?.render?.code ?? "";

  // The elided component/function wrapper is signaled with "// ...", merged with
  // each part's hint comment into continuous single lines — otherwise hooks/calls
  // read as dangling top-level statements outside any component.
  const parts: string[] = [];
  const pushSection = (body: string, hint?: string) => {
    if (!body) return;
    parts.push(
      `${parts.length > 0 ? "// ...\n" : ""}${hint ? `${hint}\n` : ""}${body}`,
    );
  };
  pushSection(importCode);
  pushSection(createCode, "// create grid store for managing schema");
  pushSection(renderCode, "// render the grid");
  const code = parts.join("\n\n");

  const language: CodeLanguage =
    basicSnippets?.create?.language ??
    basicSnippets?.import?.language ??
    (adapterId === "react-grid"
      ? "tsx"
      : adapterId === "vue-grid"
        ? "vue"
        : "typescript");

  // Real filename from the manifest (e.g. Basic.tsx, not App.tsx): the file whose
  // language matches the displayed snippet, preferring the TypeScript variant.
  const files = Object.values(manifest);
  const basicFile =
    files.find(
      (file) =>
        isSpecificExampleFile(file, "basic") && file.language === language,
    ) ??
    files.find(
      (file) =>
        isSpecificExampleFile(file, "basic") &&
        (file.language === "tsx" || file.language === "typescript"),
    ) ??
    files.find((file) => isSpecificExampleFile(file, "basic"));

  const fileName = basicFile?.name ?? "Basic.tsx";

  return {
    adapterId,
    fileName,
    language,
    code,
  };
}
