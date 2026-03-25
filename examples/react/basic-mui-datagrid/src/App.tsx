import { GridClose, StoreContextProvider, useStore } from "@jsoc/react-grid";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";

export default function App() {
  const [users, setUsers] = useState([]);
  const storeContext = useStore(users, "mui");

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  const { config } = storeContext.gridStore.getActiveSchema();

  return (
    <StoreContextProvider value={storeContext}>
      <GridClose>Back</GridClose>
      <div style={{ height: 600 }}>
        <DataGrid {...config} />
      </div>
    </StoreContextProvider>
  );
}
