"use client";

import type { GridPlugin } from "@jsoc/react-grid";
import { PolyGrid } from "@jsoc/react-polygrid";
import { useEffect, useState } from "react";

export function App() {
  const plugin: GridPlugin = "ag";
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((response) => response.json())
      .then((users) => {
        setUsers(users);
      });
  }, []);

  return (
    <div className="h-80 min-w-full m-1.5">
      <PolyGrid
        gridOptions={{
          data: users,
        }}
        plugin={plugin}
      />
    </div>
  );
}
