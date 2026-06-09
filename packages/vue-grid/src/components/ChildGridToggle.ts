import type {
  ColumnGeneratorParams,
  GridRow,
  PluginConfig,
} from "@jsoc/grid-core";

export type ChildGridToggleProps<C extends PluginConfig> = {
  columnParams: ColumnGeneratorParams<C, "ujsonObject" | "ujsonObjectArray">;
  row: GridRow;
};

export type ChildGridToggleSlotProps = {
  toggle: () => void;
  toggleStatus: boolean;
};
