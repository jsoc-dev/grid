// Imported with ?inline to scope styles directly inside the Shadow DOM and prevent leaks into the host page
import css from "#app.css?inline";
import { TableView } from "#components/TableView.tsx";
import { ViewToggle } from "#components/ViewToggle.tsx";
import { useDefaultViewSetting } from "#hooks/useDefaultViewSetting.ts";
import { useView } from "#hooks/useView.ts";

import { Activity } from "react";

export function App() {
  const [view, setView] = useView();
  const [defaultView, setDefaultView] = useDefaultViewSetting();

  return (
    <>
      <style>{css}</style>

      <ViewToggle
        view={view}
        onViewChange={setView}
        defaultView={defaultView}
        onDefaultChange={setDefaultView}
      />

      <Activity mode={view === "table" ? "visible" : "hidden"}>
        <div className="absolute top-0 h-dvh w-full z-40 bg-canvas text-canvastext">
          <TableView />
        </div>
      </Activity>
    </>
  );
}
