import basic from "./examples/Basic";
import localData from "./examples/LocalData";
import remoteData from "./examples/RemoteData";

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
          basic,
          localData,
          remoteData,
        }}
      />
    </AgGridProvider>
  );
}
