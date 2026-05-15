import { Basic, LocalData, RemoteData } from "./examples/";

import { ExamplesRouter } from "@jsoc/react-grid-examples";
import { useDetectColorScheme } from "@jsoc/react-grid-examples";
import { useEffect } from "react";

/**
 * Examples of TanStack Table rendered using JSOC Grid
 * @see {@link https://tanstack.com/table/latest TanStack Table Docs}
 */
export default function App() {
  const colorScheme = useDetectColorScheme();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", colorScheme === "dark");
  }, [colorScheme]);

  return (
    <ExamplesRouter
      pluginId="tanstack"
      components={{
        basic: Basic,
        "local-data": LocalData,
        "remote-data": RemoteData,
      }}
    />
  );
}
