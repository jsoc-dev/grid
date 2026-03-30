export type GridPlugin = (typeof GRID_PLUGIN_LIST)[number];

export const GRID_PLUGIN_LIST = ["ag", "mantine", "mui", "tanstack"] as const;
