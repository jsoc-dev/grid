import { useStoreContext } from "#hooks/useStoreContext.ts";

import {
  createSubGridId,
  type GridCellLocation,
  type GridDataReadonly,
  type GridId,
  type GridName,
} from "@jsoc/grid-core";

export type SubGridToggleRendererParams = {
  isPresent: boolean;
  name: GridName;
  toggle: () => void;
};

export type SubGridToggleProps = {
  /**
   * Custom renderer for the toggle action.
   * @param isPresent - Flag that indicates whether the subgrid is already present in store or not
   * @default DefaultSubGridToggleRenderer
   */
  children?: (params: SubGridToggleRendererParams) => React.ReactNode;
  /**
   * data of the sub grid, is actually the `ColumnValue` of the `GridRow[rowId][ColumnKey]`
   * using which the rows and columns will be generated.
   */
  subGridData: GridDataReadonly;
  /**
   * `GridId` of the grid that will render this component
   */
  parentGridId: GridId;
  /**
   * Location of the `GridCell` that will render this component
   */
  parentGridCellLocation: GridCellLocation;
};

export function SubGridToggle({
  subGridData,
  parentGridId,
  parentGridCellLocation,
  children = DefaultSubGridToggleRenderer,
}: SubGridToggleProps) {
  const { gridStore, setGridStore } = useStoreContext();

  const subGridId = createSubGridId(parentGridId, parentGridCellLocation);
  const subGridName = parentGridCellLocation.columnKey;
  const index = gridStore.findIndex(subGridId);
  const isPresent = index > -1;

  return children({
    isPresent,
    name: subGridName,
    toggle,
  });

  function toggle() {
    const storeClone = gridStore.clone();

    if (isPresent) {
      storeClone.removeSchema(index);
    } else {
      storeClone.addSchema({
        id: subGridId,
        name: subGridName,
        data: subGridData,
      });
    }

    setGridStore(storeClone);
  }
}

function DefaultSubGridToggleRenderer(params: SubGridToggleRendererParams) {
  const { name, isPresent, toggle } = params;

  const buttonText = isPresent ? "Close " : "View " + name;

  return <button onClick={toggle}>{buttonText}</button>;
}
