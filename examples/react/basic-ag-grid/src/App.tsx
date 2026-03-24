import { GridClose, StoreContextProvider, useStore } from "@jsoc/react-grid";
import { AllCommunityModule } from "ag-grid-community";
import { AgGridProvider, AgGridReact } from "ag-grid-react";
import { useEffect, useState } from "react";

const modules = [AllCommunityModule];

export default function App() {
  const [users, setUsers] = useState([]);
  const storeContext = useStore(users, "ag");

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  const { config } = storeContext.gridStore.getActiveSchema();

  return (
    <StoreContextProvider value={storeContext}>
      <AgGridProvider modules={modules}>
        <GridClose>Back</GridClose>
        <div style={{ height: 600 }}>
          <AgGridReact {...config} />
        </div>
      </AgGridProvider>
    </StoreContextProvider>
  );
}
