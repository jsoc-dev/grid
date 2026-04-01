export type GridPlugin = (typeof GRID_PLUGIN_LIST)[number];

export const GRID_PLUGIN_LIST = [
  "ag",
  "ant",
  "mantine",
  "mui",
  "tanstack",
  "prime",
] as const;
