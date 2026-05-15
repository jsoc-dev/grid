import {
  readExampleId,
  setExampleId,
  subscribeExampleId,
} from "#exampleIdSearchParam.ts";
import type { ExampleMount } from "#types.ts";

import {
  buildExampleIdSearchQuery,
  type ExampleId,
  getExampleIds,
  getExampleMetadata,
  getPluginMetadata,
  type PluginId,
} from "@jsoc/grid-docs";

export type MountExamplesRouterOptions<
  P extends PluginId<"vanilla-grid"> = PluginId<"vanilla-grid">,
> = {
  root: HTMLElement;
  pluginId: P;
  examples: {
    [EId in ExampleId<"vanilla-grid", P>]: ExampleMount;
  };
};

export function mountExamplesRouter<P extends PluginId<"vanilla-grid">>(
  options: MountExamplesRouterOptions<P>,
): () => void {
  const { root } = options;

  let disposeExample: (() => void) | undefined;

  function render() {
    disposeExample?.();
    disposeExample = undefined;
    root.replaceChildren();

    const exampleId = readExampleId();

    if (!exampleId) {
      renderIndexPage(root, options, render);
      return;
    }

    if (!(exampleId in options.examples)) {
      const message = document.createElement("p");
      message.textContent = `Invalid example ID: "${exampleId}"`;
      root.appendChild(message);
      return;
    }

    const mount = options.examples[exampleId as keyof typeof options.examples];
    disposeExample = mount(root);
  }

  const unsubscribe = subscribeExampleId(render);

  render();

  return () => {
    unsubscribe();
    disposeExample?.();
    root.replaceChildren();
  };
}

function renderIndexPage<P extends PluginId<"vanilla-grid">>(
  root: HTMLElement,
  options: MountExamplesRouterOptions<P>,
  onNavigate: () => void,
) {
  const { name } = getPluginMetadata("vanilla-grid", options.pluginId);
  const exampleIds = getExampleIds("vanilla-grid", options.pluginId);

  const nav = document.createElement("nav");
  const heading = document.createElement("h1");
  heading.textContent = `${name} x JSOC Grid`;
  nav.appendChild(heading);

  const list = document.createElement("ul");
  for (const exampleId of exampleIds) {
    const { name: exampleName } = getExampleMetadata(
      "vanilla-grid",
      options.pluginId,
      exampleId,
    );
    const item = document.createElement("li");
    const link = document.createElement("a");
    link.href = buildExampleIdSearchQuery(exampleId);
    link.textContent = exampleName;
    link.addEventListener("click", (event) => {
      event.preventDefault();
      setExampleId(exampleId);
      onNavigate();
    });
    item.appendChild(link);
    list.appendChild(item);
  }

  nav.appendChild(list);
  root.appendChild(nav);
}
