import { useStoreContext } from "#hooks/index.ts";

export type GridCloseRendererParams = {
  close: () => void;
};

export type GridCloseProps = {
  /**
   * Either a custom renderer for the close action component or a string to display as text of default close action component.
   */
  children?: string | ((params: GridCloseRendererParams) => React.ReactNode);
};

export function GridClose({ children }: GridCloseProps) {
  const { gridStore, setGridStore } = useStoreContext();
  const isRootSchema = gridStore.getSchemas().length === 1;

  if (isRootSchema) {
    return null;
  }

  const close = () => {
    const newGridStore = gridStore.clone();
    newGridStore.removeSchema();
    setGridStore(newGridStore);
  };

  const params = { close };

  if (typeof children === "function") {
    return children(params);
  }

  return DefaultGridCloseRenderer(children || "Close", params);
}

function DefaultGridCloseRenderer(
  children: string,
  params: GridCloseRendererParams,
) {
  return <button onClick={params.close}>{children}</button>;
}
