import { ExamplesRouterIndexPage } from "#router/ExamplesRouterIndexPage.tsx";
import type { ExamplesRouterOptions } from "#router/types.ts";

import { isValidExampleId, type ReactGridPluginId } from "@jsoc/grid-docs";
import { readExampleIdSearchParam } from "@jsoc/grid-examples-shared";
import type { FC } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  useSearchParams,
} from "react-router-dom";

export function ExamplesRouter<P extends ReactGridPluginId>(
  options: ExamplesRouterOptions<P>,
) {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<ExampleDispatcher {...options} />} />
      </Routes>
    </BrowserRouter>
  );
}

function ExampleDispatcher<P extends ReactGridPluginId>(
  options: ExamplesRouterOptions<P>,
) {
  const [searchParams] = useSearchParams();
  const exampleId = readExampleIdSearchParam(searchParams);

  if (!exampleId) return <ExamplesRouterIndexPage {...options} />;
  if (!isValidExampleId("react-grid", options.pluginId, exampleId))
    return `Invalid example ID: "${exampleId}"`;

  const Component = options.components[exampleId] as FC;
  return <Component />;
}
