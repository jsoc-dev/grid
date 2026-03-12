import { useOutputPaneBodyContext } from "@/app/playground/grid/_components/output/";
import { DefaultToolbarMui, JsocGrid } from "@jsoc/react/grid";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import cn from "clsx";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useState } from "react";

export function OutputGridMui() {
  const { gridData, selectedJsonOption } = useOutputPaneBodyContext();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: resolvedTheme === "dark" ? "dark" : "light",
        },
      }),
    [resolvedTheme],
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // skip DataGrid rendering for first frame as it schedules async updates which causes below warning:
  // "Can't perform a React state update on a component that hasn't mounted yet. This indicates that you have a side-effect in your render function that asynchronously tries to update the component."
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

  return (
    <ThemeProvider theme={theme}>
      <JsocGrid
        data={gridData}
        ui="mui"
        uiProps={{
          custom: {
            gridId: selectedJsonOption,
          },
          native: {
            sx: {
              "& .MuiDataGrid-columnHeaderTitle": {
                fontFamily: `"Segoe UI", Arial, sans-serif`, // since this app doesnt have Roboto so Header font was falling back to Arial which doesnt look bold on 500 weight unlike Roboto, Segoe UI.
              },
              "& .MuiDataGrid-cell": {
                fontFamily: `"Segoe UI", "Helvetica Neue", Arial, sans-serif`, // for consistency with header font
              },
            },
            showToolbar: true,
            slots: {
              toolbar: DefaultToolbarMui,
            },
          },
        }}
      />
    </ThemeProvider>
  );
}
