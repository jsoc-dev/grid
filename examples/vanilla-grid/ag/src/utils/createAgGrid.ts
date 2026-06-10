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

const themes = {
  light: themeQuartz,
  dark: themeQuartz.withPart(colorSchemeDark),
};

/**
 * Creates a JavaScript AG Grid with automatic Quartz light/dark theme based on the system preference.
 * @see {@link https://www.ag-grid.com/javascript-data-grid/getting-started/ JavaScript AG Grid}
 */
export function createAgGrid(
  eGridDiv: HTMLElement,
  gridOptions: GridOptions<GridRow>,
  params?: Params,
): GridApi<GridRow> {
  const theme = getTheme();
  const gridApi = createGrid(eGridDiv, { theme, ...gridOptions }, params);

  syncThemeWithColorScheme(gridApi);

  return gridApi;
}

function getTheme(colorScheme: ColorScheme = detectColorScheme()) {
  return themes[colorScheme];
}

function syncThemeWithColorScheme(gridApi: GridApi<GridRow>) {
  const unsubscribeColorScheme = subscribeColorScheme((colorScheme) => {
    gridApi.updateGridOptions({ theme: getTheme(colorScheme) });
  });

  gridApi.addEventListener("gridPreDestroyed", () => {
    unsubscribeColorScheme();
  });
}
