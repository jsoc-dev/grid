import "server-only";

import { getExampleManifest } from "@/artifacts/get-example-manifest";
import {
  SupportedGridEcosystem,
  type GridPluginSnippetData,
} from "@/components/home/headless-ui/SupportedGridEcosystem";
import {
  isSpecificExampleFile,
  removeSnippetMarkers,
  type ReactGridPluginId,
} from "@jsoc/grid-docs";
import Link from "next/link";

const PLUGINS: ReactGridPluginId[] = [
  "tanstack",
  "ag",
  "mui",
  "mantine",
  "ant",
  "prime",
];

function getPluginSnippet(pluginId: ReactGridPluginId): GridPluginSnippetData {
  const manifest = getExampleManifest("react-grid", pluginId);
  const files = Object.values(manifest);
  // Whole Basic example source (not just the import/create/render snippets),
  // markers stripped. Prefer the TypeScript variant.
  const basicFile =
    files.find(
      (file) =>
        isSpecificExampleFile(file, "basic") &&
        (file.language === "tsx" || file.language === "typescript"),
    ) ?? files.find((file) => isSpecificExampleFile(file, "basic"));

  if (!basicFile) {
    throw new Error(`Basic example file not found for plugin "${pluginId}".`);
  }

  return {
    pluginId,
    code: removeSnippetMarkers(basicFile.code),
    language: basicFile.language,
    fileName: basicFile.name,
    docsHref: `/examples/react-grid/${pluginId}`,
  };
}

export function HeadlessUiSection() {
  const snippets = Object.fromEntries(
    PLUGINS.map((id) => [id, getPluginSnippet(id)]),
  ) as Record<ReactGridPluginId, GridPluginSnippetData>;

  return (
    <section className="space-y-12 border-t border-neutral-200 pt-16 dark:border-neutral-800">
      <div className="max-w-2xl space-y-3">
        <div className="text-xs font-semibold uppercase tracking-wider text-accent-600 dark:text-accent-400">
          Headless UI
        </div>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Integrate your favourite UI library
        </h2>
        <p className="leading-relaxed text-neutral-600 dark:text-neutral-400">
          JSOC Grid ships no custom HTML or CSS — you own the UI. The generated
          schema converts into native configurations with the help of UI
          plugins. Complete catalog of UI plugins can be found{" "}
          <Link
            href="/docs/plugins"
            className="font-medium text-accent-600 underline-offset-4 hover:underline dark:text-accent-400"
          >
            here
          </Link>
          .
        </p>
      </div>

      <SupportedGridEcosystem snippets={snippets} />
    </section>
  );
}
