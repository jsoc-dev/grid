import { Basic, LocalData, RemoteData } from "./examples/";

import { ExamplesRouter } from "@jsoc/react-grid-examples";
import { useDetectColorScheme } from "@jsoc/react-grid-examples";
import { MantineProvider } from "@mantine/core";

/**
 * Examples of MantineReactTable rendered using JSOC Grid
 * @see {@link https://www.mantine-react-table.com/docs/getting-started/ MantineReactTable Docs}
 */
export default function App() {
  const colorScheme = useDetectColorScheme();

  return (
    <MantineProvider theme={{ colorScheme }}>
      <ExamplesRouter
        pluginId="mantine"
        components={{
          basic: Basic,
          "local-data": LocalData,
          "remote-data": RemoteData,
        }}
      />
    </MantineProvider>
  );
}
