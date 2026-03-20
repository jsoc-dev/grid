import { useStoreContext } from "#hooks/index.ts";
import {
  type GridId,
  type GridDataReadonly,
  type GridCellLocation,
  createSubGridId,
} from "@jsoc/grid-core";

export function useToggleSubGrid(
  subGridData: GridDataReadonly,
  parentGridId: GridId,
  parentGridCellLocation: GridCellLocation,
) {
  const { gridStore, setGridStore } = useStoreContext();

  const subGridId = createSubGridId(parentGridId, parentGridCellLocation);
  const subGridName = parentGridCellLocation.columnKey;
  const { index } = gridStore.search(subGridId);

  const isPresentInStore = index > -1;
  const toggleText = (isPresentInStore ? "Close" : "View") + " " + subGridName;
  const toggleSubGrid = () => {
    const storeClone = gridStore.clone();
    isPresentInStore
      ? storeClone.removeSchema(index)
      : storeClone.addSchema({
          id: subGridId,
          name: subGridName,
          data: subGridData,
        });

    setGridStore(storeClone);
  };

  return {
    isPresentInStore,
    toggleSubGrid,
    toggleText,
  };
}
