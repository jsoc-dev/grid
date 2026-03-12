import { JsocGridContext } from "#grid/JsocGrid.tsx";
import { useContext } from "react";

export function useGridSchemaStore() {
  const { gridSchemaStore, setGridSchemaStore } = useContext(JsocGridContext);

  return {
    gridSchemaStore,
    setGridSchemaStore,
  };
}
