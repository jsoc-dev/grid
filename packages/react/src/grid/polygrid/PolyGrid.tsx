import { DefaultLayout } from "#grid/polygrid/DefaultLayout.tsx";
import {
  type ConfigByPlugin,
  type GridPlugin,
  type PluginPropsAg,
  type PluginPropsMui,
  CONFIG_GENERATOR_BY_PLUGIN,
  StoreContext,
  useStore,
} from "#grid/index.ts";
import {
  type PluginConfigGeneratorOptions,
  type GridOptions,
} from "@jsoc/core/grid";
import { DataGrid } from "@mui/x-data-grid";
import { AgGridReact } from "ag-grid-react";
import { type ReactNode, Activity, type ElementType } from "react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";

// for AG-Grid
ModuleRegistry.registerModules([AllCommunityModule]);

interface PropsByPlugin extends Record<GridPlugin, {}> {
  ag: PluginPropsAg;
  mui: PluginPropsMui;
}

const GridComponentByPlugin: {
  [P in GridPlugin]: ElementType;
} = {
  ag: AgGridReact,
  mui: DataGrid,
};

export type GridLayout = React.ComponentType<{
  children: ReactNode;
}>;

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
  const { gridStore, setGridStore } = useStore(
    gridOptions,
    CONFIG_GENERATOR_BY_PLUGIN[plugin],
    configGeneratorOptions,
  );
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
