import {
  notifyLocationChange,
  subscribeLocationChange,
} from "#subscribables/subscribeLocationChange.ts";

import {
  buildExampleIdSearchQuery,
  EXAMPLE_ID_SEARCH_PARAM,
  type ExampleId,
  getExampleIds,
  getExampleMetadata,
  getPluginMetadata,
  type PluginId,
} from "@jsoc/grid-docs";

export type Dispose = () => void;
export type DisposeExample = Dispose;
export type DisposeExamplesRouter = Dispose;
export type ExampleRenderer = (root: HTMLElement) => DisposeExample;
export type ExamplesRouterProps<
  P extends PluginId<"vanilla-grid"> = PluginId<"vanilla-grid">,
> = {
  root: HTMLElement;
  pluginId: P;
  renderers: {
    [EId in ExampleId<"vanilla-grid", P>]: ExampleRenderer;
  };
};

export function mountExamplesRouter<P extends PluginId<"vanilla-grid">>(
  options: ExamplesRouterProps<P>,
): DisposeExamplesRouter {
  let disposeExample = renderExample(options);

  const unsubscribeLocationChange = subscribeLocationChange(() => {
    disposeExample?.();
    disposeExample = renderExample(options);
  });

  // return a function that disposes the examples router and its children
  return () => {
    disposeExample?.();
    unsubscribeLocationChange();
  };
}

function renderExample(
  options: ExamplesRouterProps,
): DisposeExample | undefined {
  const { root, renderers } = options;

  const exampleId = new URLSearchParams(window.location.search).get(
    EXAMPLE_ID_SEARCH_PARAM,
  );

  if (!exampleId) {
    root.replaceChildren(<IndexPage options={options} />);
    return;
  }

  if (!(exampleId in renderers)) {
    root.replaceChildren(<NotFoundPage />);
    return;
  }

  root.replaceChildren();
  const exampleRenderer = renderers[exampleId];
  return exampleRenderer(root);
}

function NotFoundPage() {
  return (<p>Example not found</p>) as HTMLElement;
}

function IndexPage({ options }: { options: ExamplesRouterProps }) {
  const { pluginId } = options;
  const { name } = getPluginMetadata("vanilla-grid", pluginId);
  const exampleIds = getExampleIds("vanilla-grid", pluginId);

  return (
    <nav>
      <h1>{name} x JSOC Grid</h1>
      <ul>
        {exampleIds.map((exampleId) => (
          <ExampleLink
            key={exampleId}
            pluginId={pluginId}
            exampleId={exampleId}
          />
        ))}
      </ul>
    </nav>
  ) as HTMLElement;
}

type ExampleLinkProps<P extends PluginId<"vanilla-grid">> = {
  pluginId: P;
  exampleId: ExampleId<"vanilla-grid", P>;
};

function ExampleLink<P extends PluginId<"vanilla-grid">>({
  pluginId,
  exampleId,
}: ExampleLinkProps<P>) {
  const { name: exampleName } = getExampleMetadata(
    "vanilla-grid",
    pluginId,
    exampleId,
  );

  return (
    <li>
      <a
        href={buildExampleIdSearchQuery(exampleId)}
        onClick={(event: Event) => {
          event.preventDefault();

          const url = new URL(window.location.href);
          url.searchParams.set(EXAMPLE_ID_SEARCH_PARAM, exampleId);
          history.pushState(null, "", url);
          notifyLocationChange();
        }}
      >
        {exampleName}
      </a>
    </li>
  ) as HTMLElement;
}
