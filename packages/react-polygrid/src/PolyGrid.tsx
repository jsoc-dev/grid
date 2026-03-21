import { DefaultLayout } from "#components/DefaultLayout.tsx";
import { getConfigGeneratorOptions } from "#customizations/configGeneratorOptions.tsx";

import type {
  GridOptions,
  PluginConfigGeneratorOptions,
} from "@jsoc/grid-core";
import {
  CONFIG_GENERATOR_BY_PLUGIN,
  type ConfigByPlugin,
  type GridPlugin,
  type PluginPropsAg,
  type PluginPropsMui,
  StoreContext,
  useStore,
} from "@jsoc/react-grid";
import { DataGrid } from "@mui/x-data-grid";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { Activity, type ElementType, type ReactNode } from "react";

// TODO: Remove this. Add in docs that users need to import the required modules themselves if they use ag-grid.
ModuleRegistry.registerModules([AllCommunityModule]);

interface PropsByPlugin extends Record<GridPlugin, unknown> {
  ag: PluginPropsAg;
  mui: PluginPropsMui;
}

const GridComponentByPlugin: {
  [P in GridPlugin]: ElementType;
} = {
  ag: AgGridReact,
  mui: DataGrid,
};

export type GridLayoutProps = {
  children: ReactNode;
};
export type GridLayout = React.ComponentType<GridLayoutProps>;

export type PolyGridProps<P extends GridPlugin> = {
  configGeneratorOptions?: PluginConfigGeneratorOptions<ConfigByPlugin[P]>;
  gridOptions: GridOptions;
  plugin: P;
  pluginProps?: PropsByPlugin[P];
  /**
   * Layout component.
   * @default DefaultLayout
   */
  Layout?: GridLayout;
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
  configGeneratorOptions,
  gridOptions,
  Layout = DefaultLayout,
  plugin,
  pluginProps,
}: PolyGridProps<P>) {
  const cg = CONFIG_GENERATOR_BY_PLUGIN[plugin];
  const cgOptions = configGeneratorOptions ?? getConfigGeneratorOptions(plugin);
  const { gridStore, setGridStore } = useStore(gridOptions, cg, cgOptions);
  const activeSchema = gridStore.getActiveSchema();
  const PluginComponent = GridComponentByPlugin[plugin];

  return (
    <StoreContext.Provider
      value={{
        gridStore,
        setGridStore,
      }}
    >
      <Layout>
        {gridStore.map((schema) => (
          <Activity
            key={schema.options.id}
            mode={
              schema.options.id === activeSchema.options.id
                ? "visible"
                : "hidden"
            }
          >
            {/* @ts-expect-error - FIXME */}
            <PluginComponent {...{ ...pluginProps, ...schema.config }} />
          </Activity>
        ))}
      </Layout>
    </StoreContext.Provider>
  );
}
