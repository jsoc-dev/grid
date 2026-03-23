import type {
  GridOptions,
  PluginConfigGeneratorOptions,
} from "@jsoc/grid-core";
import {
  CONFIG_GENERATOR_BY_PLUGIN,
  type ConfigByPlugin,
  type GridPlugin,
  StoreContext,
  useStore,
} from "@jsoc/react-grid";
import React, { type ReactNode } from "react";


export type GridLayoutProps = {
  children: ReactNode;
};
export type GridLayout = React.ComponentType<GridLayoutProps>;

export type PolyGridProps<P extends GridPlugin> = {
  children: ReactNode;
  gridOptions: GridOptions;
  plugin: P;
  pluginConfigGeneratorOptions?: PluginConfigGeneratorOptions<
    ConfigByPlugin[P]
  >;
};

/**
 * TODO: Add docs post refactoring
 */
export function PolyGrid<P extends GridPlugin>(props: PolyGridProps<P>) {
  return (
    /* force remount of inner tree when plugin changes using key prop
      This is required because the plugin specific store is saved in a state using useStore hook
      in case plugin changes, the store is updated in the next render cycle (as useEffect is used which is async)
      which causes the plugin component to be rendered with the old plugin's resulting in errors */
    <PolyGridInner key={props.plugin} {...props} />
  );
}

function PolyGridInner<P extends GridPlugin>({
  children,
  gridOptions,
  plugin,
  pluginConfigGeneratorOptions,
}: PolyGridProps<P>) {
  const pluginOptions = {
    configGenerator: CONFIG_GENERATOR_BY_PLUGIN[plugin],
    configGeneratorOptions: pluginConfigGeneratorOptions,
  };
  const { gridStore, setGridStore } = useStore(gridOptions, pluginOptions);

  return (
    <StoreContext.Provider
      value={{
        gridStore,
        setGridStore,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}
