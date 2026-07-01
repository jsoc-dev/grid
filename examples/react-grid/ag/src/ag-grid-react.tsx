// eslint-disable-next-line react-refresh/only-export-components
export * from "ag-grid-react";

import { AgGridReact as AgGrid, type AgGridReactProps } from "ag-grid-react";
import { useDetectColorScheme } from "@jsoc/react-grid-examples";
import { colorSchemeDark, themeQuartz } from "ag-grid-community";

const themes = {
  light: themeQuartz,
  dark: themeQuartz.withPart(colorSchemeDark),
};

/** {@link AgGrid} with automatic Quartz light/dark theme based on the system preference. */
export function AgGridReact(props: AgGridReactProps) {
  const colorScheme = useDetectColorScheme();
  const theme = themes[colorScheme];
  return <AgGrid theme={theme} {...props} />;
}
