import { useStoreContext } from "#hooks/index.ts";

import type { GridIndex } from "@jsoc/grid-core";

export function useNavigation(index: GridIndex) {
  const { gridStore, setGridStore } = useStoreContext();
  const gridSchema = gridStore[index];

  return {
    gridSchema,
    gridStore,
    activateGrid,
    removeGrid,
  };

  function activateGrid() {
    const storeClone = gridStore.clone();
    storeClone.setActiveIndex(index);
    setGridStore(storeClone);
  }

  function removeGrid() {
    const storeClone = gridStore.clone();
    storeClone.removeSchema(index);
    setGridStore(storeClone);
  }
}
