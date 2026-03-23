import type { GridOptions } from "@jsoc/grid-core";
import { GridClose, StoreContext, useStore } from "@jsoc/react-grid";
import { AllCommunityModule } from "ag-grid-community";
import { AgGridProvider, AgGridReact } from "ag-grid-react"; // React Data Grid Component
import { useEffect, useState } from "react";

const modules = [AllCommunityModule];

export default function App() {
  const [gridOptions, setGridOptions] = useState<GridOptions>({ data: [] });
  const { gridStore, setGridStore } = useStore(gridOptions, "ag");

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((data) => setGridOptions({ data }));
  }, []);

  const { config } = gridStore.getActiveSchema();

  return (
    <StoreContext.Provider value={{ gridStore, setGridStore }}>
      <AgGridProvider modules={modules}>
        <GridClose>
          {({ close }) => <button onClick={close}>Go Back</button>}
        </GridClose>
        <div style={{ height: 600 }}>
          <AgGridReact {...config} />
        </div>
      </AgGridProvider>
    </StoreContext.Provider>
  );
}
