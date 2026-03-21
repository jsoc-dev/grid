import { useStoreContext } from "#hooks/index.ts";

import {
  createSubGridId,
  type GridCellLocation,
  type GridDataReadonly,
  type GridId,
} from "@jsoc/grid-core";

export function useToggleSubGrid(
  subGridData: GridDataReadonly,
  parentGridId: GridId,
  parentGridCellLocation: GridCellLocation,
) {
  const { gridStore, setGridStore } = useStoreContext();

  const subGridId = createSubGridId(parentGridId, parentGridCellLocation);
  const subGridName = parentGridCellLocation.columnKey;
  const index = gridStore.findIndex(subGridId);

  const isPresentInStore = index > -1;
  const toggleText = (isPresentInStore ? "Close" : "View") + " " + subGridName;
  const toggleSubGrid = () => {
    const storeClone = gridStore.clone();

    if (isPresentInStore) {
      storeClone.removeSchema(index);
    } else {
      storeClone.addSchema({
        id: subGridId,
        name: subGridName,
        data: subGridData,
      });
    }

    setGridStore(storeClone);
  };

  return {
    isPresentInStore,
    toggleSubGrid,
    toggleText,
  };
}
