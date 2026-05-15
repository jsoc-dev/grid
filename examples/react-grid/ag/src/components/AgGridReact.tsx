import { colorSchemeDark, themeQuartz } from "ag-grid-community";
import { AgGridReact as AgGrid, type AgGridReactProps } from "ag-grid-react";
import { useDetectColorScheme } from "@jsoc/react-grid-examples";

/**
 * AgGridReact component with automatic theme detection.
 * @param props - The props for the AgGridReact component.
 */
export function AgGridReact(props: AgGridReactProps) {
  const colorScheme = useDetectColorScheme();
  const theme =
    colorScheme === "dark"
      ? themeQuartz.withPart(colorSchemeDark)
      : themeQuartz;

  return <AgGrid theme={theme} {...props} />;
}
