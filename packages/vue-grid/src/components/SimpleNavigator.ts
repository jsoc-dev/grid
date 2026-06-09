import type { GridStore, PluginConfig } from "@jsoc/grid-core";

export type SimpleNavigatorProps<C extends PluginConfig> = {
  gridStore: GridStore<C>;
};

export type SimpleNavigatorSlotProps = {
  canRemove: boolean;
  removeActiveSchema: () => void;
};
