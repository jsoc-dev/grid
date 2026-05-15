import {
  buildExampleIdSearchQuery,
  EXAMPLE_ID_SEARCH_PARAM,
  type ExampleId,
  getExampleIds,
  getExampleMetadata,
  getPluginMetadata,
  type PluginId,
} from "@jsoc/grid-docs";
import { createContext, type FC, useContext } from "react";
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useSearchParams,
} from "react-router-dom";

export type ExamplesRouterProps<
  P extends PluginId<"react-grid"> = PluginId<"react-grid">,
> = {
  pluginId: P;
  components: {
    [EId in ExampleId<"react-grid", P>]: FC;
  };
};

const ExampleRouterContext = createContext<ExamplesRouterProps | null>(null);

export function ExamplesRouter<P extends PluginId<"react-grid">>(
  props: ExamplesRouterProps<P>,
) {
  return (
    <ExampleRouterContext.Provider value={props}>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<ExampleDispatcher />} />
        </Routes>
      </BrowserRouter>
    </ExampleRouterContext.Provider>
  );
}

function useExampleRouterContext() {
  const context = useContext(ExampleRouterContext);
  if (!context) {
    throw new Error(
      "useExampleRouterContext must be used within an ExampleRouter",
    );
  }
  return context;
}

function ExampleDispatcher() {
  const { components } = useExampleRouterContext();
  const [searchParams] = useSearchParams();
  const exampleId = searchParams.get(EXAMPLE_ID_SEARCH_PARAM);

  if (exampleId) {
    if (!(exampleId in components)) {
      return `Invalid example ID: "${exampleId}"`;
    }

    const Component = components[exampleId];
    return <Component />;
  }

  return <ExamplesIndexPage />;
}

function ExamplesIndexPage() {
  const { pluginId } = useExampleRouterContext();
  const { name } = getPluginMetadata("react-grid", pluginId);
  const exampleIds = getExampleIds("react-grid", pluginId);

  return (
    <>
      <nav>
        <h1>{name} x JSOC Grid</h1>
        <ul>
          {exampleIds.map((exampleId) => {
            const { name } = getExampleMetadata(
              "react-grid",
              pluginId,
              exampleId,
            );
            return (
              <li key={exampleId}>
                <Link to={buildExampleIdSearchQuery(exampleId)}>{name}</Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
