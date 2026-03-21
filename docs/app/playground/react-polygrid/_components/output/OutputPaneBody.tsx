import { ErrorMessage } from "@/_components";
import type { GridOptionsState } from "@/playground/react-polygrid/Playground";

import type { GridPlugin } from "@jsoc/react-grid";
import { PolyGrid } from "@jsoc/react-polygrid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { colorSchemeDark, themeQuartz } from "ag-grid-community";
import cn from "clsx";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface Props extends GridOptionsState {
  plugin: GridPlugin;
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
  if (!mounted) {
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

  const pluginProps = getPluginProps(plugin, resolvedTheme);

  return (
    <ThemeProvider
      /* to provide theme to the SubGridToggle button which uses GridOn,GridOff icons from @mui/icons-material */
      theme={theme}
    >
      <ErrorBoundary
        /* remount when there is an error and user changes data */
        resetKeys={[gridOptions.data]}
        fallbackRender={({ error }) => <ErrorMessage error={error} />}
      >
        <PolyGrid
          gridOptions={gridOptions}
          plugin={plugin}
          pluginProps={pluginProps}
        />
      </ErrorBoundary>
    </ThemeProvider>
  );
}

function getPluginProps(plugin: GridPlugin, resolvedTheme?: string) {
  switch (plugin) {
    case "ag":
      return {
        theme:
          resolvedTheme === "dark"
            ? themeQuartz.withPart(colorSchemeDark)
            : themeQuartz,
      };

    case "mui":
      return {
        sx: {
          "& .MuiDataGrid-columnHeaderTitle": {
            fontFamily: `"Segoe UI", Arial, sans-serif`, // since this app doesnt have Roboto so Header font was falling back to Arial which doesnt look bold on 500 weight unlike Roboto, Segoe UI.
          },
          "& .MuiDataGrid-cell": {
            fontFamily: `"Segoe UI", "Helvetica Neue", Arial, sans-serif`, // for consistency with header font
          },
        },
      };

    default:
      return {};
  }
}
