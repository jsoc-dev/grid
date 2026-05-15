import { Basic, LocalData, RemoteData } from "./examples/";

import { AllCommunityModule } from "ag-grid-community";
import { AgGridProvider } from "ag-grid-react";
import { ExamplesRouter } from "@jsoc/react-grid-examples";

const modules = [AllCommunityModule];

/**
 * Examples of AgGridReact rendered using JSOC Grid
 * @see {@link https://www.ag-grid.com/react-data-grid/getting-started/ AgGridReact Docs}
 */
export default function App() {
  return (
    <AgGridProvider modules={modules}>
      <ExamplesRouter
        pluginId="ag"
        components={{
          basic: Basic,
          "local-data": LocalData,
          "remote-data": RemoteData,
        }}
      />
    </AgGridProvider>
  );
}
