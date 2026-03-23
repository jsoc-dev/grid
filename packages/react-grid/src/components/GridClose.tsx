import { useStoreContext } from "#hooks/index.ts";

export type GridCloseRendererParams = {
  close: () => void;
};

export type GridCloseProps = {
  /**
   * Custom renderer for the close action.
   * @param close - Function to close the current schema
   * @default DefaultGridCloseRenderer
   */
  children?: (params: GridCloseRendererParams) => React.ReactNode;
};

export function GridClose({
  children = DefaultGridCloseRenderer,
}: GridCloseProps) {
  const { gridStore, setGridStore } = useStoreContext();
  const isRootSchema = gridStore.getSchemas().length === 1;

  if (isRootSchema) {
    return null;
  }

  return children({ close });

  function close() {
    const newGridStore = gridStore.clone();
    newGridStore.removeSchema();
    setGridStore(newGridStore);
  }
}

function DefaultGridCloseRenderer(params: GridCloseRendererParams) {
  const { close } = params;

  return <button onClick={close}>Close</button>;
}
