import type { ColumnGeneratorParams, GridRow } from "@jsoc/grid-core";
import { ChildGridToggle } from "@jsoc/vue-grid";
import type { ICellRendererParams } from "ag-grid-community";
import { defineComponent, h, type PropType } from "vue";

export type ChildGridToggleCellRendererCustomParams = {
  columnParams: ColumnGeneratorParams<"ujsonObject" | "ujsonObjectArray">;
};

export type ChildGridToggleCellRendererParams = ICellRendererParams<GridRow> &
  ChildGridToggleCellRendererCustomParams;

/**
 * AG Grid Vue cell renderer for {@link ChildGridToggle}.
 * Pass {@link ChildGridToggleCellRendererCustomParams} via `cellRendererParams`.
 *
 * Inherits {@link GridStoreProvider} from the grid's parent tree via ag-grid-vue3's
 * `Object.create(parent.provides)` when mounting framework components.
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

      return h(ChildGridToggle, {
        row,
        columnKey: columnParams.columnKey,
      });
    };
  },
});
