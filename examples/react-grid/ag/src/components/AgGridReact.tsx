import { AgGridReact as AgGrid, type AgGridReactProps } from "ag-grid-react";
import { useDetectColorScheme } from "@jsoc/react-grid-examples";
import { colorSchemeDark, themeQuartz } from "ag-grid-community";

const themes = {
  light: themeQuartz,
  dark: themeQuartz.withPart(colorSchemeDark),
};

/**
 * `AgGridReact` with automatic Quartz light/dark theme based on the system preference.
 * @see {@link https://www.ag-grid.com/react-data-grid/getting-started/ AG Grid React}
 */
export function AgGridReact(props: AgGridReactProps) {
  const theme = useTheme();
  return <AgGrid theme={theme} {...props} />;
}

function useTheme() {
  const colorScheme = useDetectColorScheme();
  return themes[colorScheme];
}
