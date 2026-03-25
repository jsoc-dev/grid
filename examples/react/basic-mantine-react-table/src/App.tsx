import { GridClose, StoreContextProvider, useStore } from "@jsoc/react-grid";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { useEffect, useState } from "react";

export default function App() {
  const [users, setUsers] = useState([]);
  const storeContext = useStore(users, "mantine");

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  const { config } = storeContext.gridStore.getActiveSchema();
  const table = useMantineReactTable(config);

  return (
    <StoreContextProvider value={storeContext}>
      <GridClose>Back</GridClose>
      <div style={{ height: "700px" }}>
        <MantineReactTable table={table} />
      </div>
    </StoreContextProvider>
  );
}
