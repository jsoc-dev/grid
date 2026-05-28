import { subscribeWindowNavigation } from "#/router/subscribeWindowNavigation.ts";

import {
  buildExampleIdSearchQuery,
  EXAMPLE_ID_SEARCH_PARAM,
  type ExampleId,
  getExampleIds,
  getExampleMetadata,
  getPluginMetadata,
  type PluginId,
} from "@jsoc/grid-docs";
import { html, render, type TemplateResult } from "lit-html";

export type ExampleRendererCleanup = () => void;
export type ExampleRenderer = (root: HTMLElement) => ExampleRendererCleanup;

export type ExamplesRouterOptions<
  P extends PluginId<"vanilla-grid"> = PluginId<"vanilla-grid">,
> = {
  root: HTMLElement;
  pluginId: P;
  renderers: {
    [EId in ExampleId<"vanilla-grid", P>]: ExampleRenderer;
  };
};

export function mountExamplesRouter<P extends PluginId<"vanilla-grid">>(
  options: ExamplesRouterOptions<P>,
): () => void {
  let cleanup = renderExample(options);

  const unsubscribeWindowNavigation = subscribeWindowNavigation(() => {
    cleanup?.();
    cleanup = renderExample(options);
  });

  return () => {
    cleanup?.();
    unsubscribeWindowNavigation();
  };
}

function renderExample(options: ExamplesRouterOptions) {
  const { renderers, root } = options;
  const exampleId = readExampleId();

  if (!exampleId) return renderIndexPage(options);
  if (!(exampleId in renderers)) return renderNotFound(root);

  const renderer = renderers[exampleId];
  return renderer(root);
}

function renderNotFound(container: HTMLElement) {
  render(html` <p>Example not found</p> `, container);
}

function renderIndexPage(options: ExamplesRouterOptions) {
  const { pluginId } = options;
  const { name } = getPluginMetadata("vanilla-grid", pluginId);
  const exampleIds = getExampleIds("vanilla-grid", pluginId);

  const listItems = exampleIds.map((exampleId) =>
    ExampleLink(pluginId, exampleId),
  );

  render(
    html`
      <nav>
        <h1>${name} x JSOC Grid</h1>
        <ul>
          ${listItems}
        </ul>
      </nav>
    `,
    options.root,
  );
}

function ExampleLink<P extends PluginId<"vanilla-grid">>(
  pluginId: P,
  exampleId: ExampleId<"vanilla-grid", P>,
): TemplateResult {
  const { name: exampleName } = getExampleMetadata(
    "vanilla-grid",
    pluginId,
    exampleId,
  );

  return html`
    <li>
      <a
        href=${buildExampleIdSearchQuery(exampleId)}
        @click=${(event: Event) => {
          event.preventDefault();
          setExampleId(exampleId);
        }}
      >
        ${exampleName}
      </a>
    </li>
  `;
}

function readExampleId() {
  return new URLSearchParams(window.location.search).get(
    EXAMPLE_ID_SEARCH_PARAM,
  );
}

function setExampleId(id: string) {
  const url = new URL(window.location.href);

  url.searchParams.set(EXAMPLE_ID_SEARCH_PARAM, id);
  window.navigation.navigate(url, { history: "push" });
}
