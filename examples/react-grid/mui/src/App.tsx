import { Basic, LocalData, RemoteData } from "./examples/";

import { ExamplesRouter } from "@jsoc/react-grid-examples";
import { useDetectColorScheme } from "@jsoc/react-grid-examples";
import { createTheme, ThemeProvider } from "@mui/material";
import { useMemo } from "react";

/**
 * Examples of MUI DataGrid rendered using JSOC Grid
 * @see {@link https://mui.com/x/react-data-grid/quickstart/ MUI DataGrid Docs}
 */
export default function App() {
  const mode = useDetectColorScheme();
  const theme = useMemo(() => createTheme({ palette: { mode } }), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <ExamplesRouter
        pluginId="mui"
        components={{
          basic: Basic,
          "local-data": LocalData,
          "remote-data": RemoteData,
        }}
      />
    </ThemeProvider>
  );
}
