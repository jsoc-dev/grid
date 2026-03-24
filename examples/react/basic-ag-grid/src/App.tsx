import type { GridOptions } from "@jsoc/grid-core";
import { GridClose, StoreContextProvider, useStore } from "@jsoc/react-grid";
import { AllCommunityModule } from "ag-grid-community";
import { AgGridProvider, AgGridReact } from "ag-grid-react";
import { useEffect, useState } from "react";

const modules = [AllCommunityModule];

export default function App() {
  const [gridOptions, setGridOptions] = useState<GridOptions>({ data: [] });
  const storeCtx = useStore(gridOptions, "ag");

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((data) => setGridOptions({ data }));
  }, []);

  const { config } = storeCtx.gridStore.getActiveSchema();

  return (
    <StoreContextProvider value={storeCtx}>
      <AgGridProvider modules={modules}>
        <GridClose>
          {({ close }) => <button onClick={close}>Go Back</button>}
        </GridClose>
        <div style={{ height: 600 }}>
          <AgGridReact {...config} />
        </div>
      </AgGridProvider>
    </StoreContextProvider>
  );
}
