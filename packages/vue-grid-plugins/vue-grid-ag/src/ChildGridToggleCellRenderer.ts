import type { PluginConfigAg } from "#types.ts";

import type { ColumnGeneratorParams, GridRow } from "@jsoc/grid-core";
import { renderChildGridToggle } from "@jsoc/vue-grid";
import type { ICellRendererParams } from "ag-grid-community";
import { defineComponent, type PropType } from "vue";

export type ChildGridToggleCellRendererCustomParams = {
  columnParams: ColumnGeneratorParams<
    PluginConfigAg,
    "ujsonObject" | "ujsonObjectArray"
  >;
};

export type ChildGridToggleCellRendererParams = ICellRendererParams<GridRow> &
  ChildGridToggleCellRendererCustomParams;

/**
 * AG Grid Vue cell renderer for {@link ChildGridToggle}.
 * Pass {@link ChildGridToggleCellRendererCustomParams} via `cellRendererParams`.
 *
 * @see https://www.ag-grid.com/vue-data-grid/component-cell-renderer/
 */
export const ChildGridToggleCellRenderer = defineComponent({
  name: "ChildGridToggleCellRenderer",
  props: {
    params: {
      type: Object as PropType<ChildGridToggleCellRendererParams>,
      required: true,
    },
  },
  setup(props) {
    return () => {
      const { data: row, columnParams } = props.params;
      if (!row) return null;

      return renderChildGridToggle({
        row,
        columnParams,
      });
    };
  },
});
