import {
  colorSchemeDark,
  createGrid,
  themeQuartz,
  type GridApi,
  type GridOptions,
  type Params,
} from "ag-grid-community";
import type { GridRow } from "@jsoc/grid-core";
import {
  detectColorScheme,
  subscribeColorScheme,
  type ColorScheme,
} from "@jsoc/vanilla-grid-examples";

/**
 * Creates AG Grid with automatic detection of color scheme and default theme.
 */
export function createAgGrid(
  eGridDiv: HTMLElement,
  gridOptions: GridOptions<GridRow>,
  params?: Params,
): GridApi<GridRow> {
  const colorScheme = detectColorScheme();
  const gridApi = createGrid(
    eGridDiv,
    { theme: getTheme(colorScheme), ...gridOptions },
    params,
  );

  const unsubscribeColorScheme = subscribeColorScheme((colorScheme) => {
    gridApi.updateGridOptions({ theme: getTheme(colorScheme) });
  });

  gridApi.addEventListener("gridPreDestroyed", () => {
    unsubscribeColorScheme();
  });

  return gridApi;
}

function getTheme(colorScheme: ColorScheme) {
  return colorScheme === "dark"
    ? themeQuartz.withPart(colorSchemeDark)
    : themeQuartz;
}
