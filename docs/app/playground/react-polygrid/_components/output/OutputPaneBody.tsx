import { ErrorMessage } from "@/_components";
import { RenderersByPlugin } from "@/playground/react-polygrid/_components/output/plugin-renderers/renderersByPlugin";
import type { GridOptionsState, NonHeadlessPlugins } from "@/playground/react-polygrid/Playground";

import {
  StoreContext,
} from "@jsoc/react-grid";
import { Navigator } from "@jsoc/react-polygrid";
import { PolyGrid } from "@jsoc/react-polygrid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import cn from "clsx";
import { useTheme } from "next-themes";
import { Activity, useEffect, useMemo, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface Props extends GridOptionsState {
  plugin: NonHeadlessPlugins;
}

export function OutputPaneBody({ gridOptions, plugin }: Props) {
  const { resolvedTheme } = useTheme();
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: resolvedTheme === "dark" ? "dark" : "light",
        },
      }),
    [resolvedTheme],
  );

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // skip rendering for first render as MUI DataGrid schedules async updates which causes below warning:
  // "Can't perform a React state update on a component that hasn't mounted yet. This indicates that you have a side-effect in your render function that asynchronously tries to update the component."
  // Also, there is a theme issue which causes text to appear black in dark theme.
  if (!mounted) return <Loading />;

  const Renderer = RenderersByPlugin[plugin];

  return (
    <ThemeProvider
      /* to provide theme to the SubGridToggle button which uses GridOn,GridOff icons from @mui/icons-material */
      theme={theme}
    >
      <ErrorBoundary
        /* remount when there is an error and user changes data or plugin */
        resetKeys={[gridOptions.data, plugin]}
        fallbackRender={({ error }) => <ErrorMessage error={error} />}
      >
        <PolyGrid gridOptions={gridOptions} plugin={plugin}>
          <StoreContext.Consumer>
            {(ctx) => {
              if (!ctx) throw new Error("StoreContext not found");
              const { gridStore } = ctx;
              const activeSchema = gridStore.getActiveSchema();
              const allSchemas = gridStore.getSchemas();
              return allSchemas.map((schema) => (
                <Activity
                  key={schema.options.id}
                  mode={
                    schema.options.id === activeSchema.options.id
                      ? "visible"
                      : "hidden"
                  }
                >
                  <Navigator />
                  <Renderer schema={schema} />
                </Activity>
              ));
            }}
          </StoreContext.Consumer>
        </PolyGrid>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

function Loading() {
  return (
    <div
      className={cn(
        "bg-background border border-border h-full rounded-sm",
        "flex justify-center items-center",
      )}
    >
      Loading...
    </div>
  );
}
