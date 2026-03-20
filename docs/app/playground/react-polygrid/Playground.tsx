"use client";

import { SplitView } from "@/app/_components";
import {
  InputPaneHead,
  InputPaneBody,
} from "@/app/playground/react-polygrid/_components/input";
import {
  OutputPaneBody,
  OutputPaneHead,
} from "@/app/playground/react-polygrid/_components/output";
import { SAMPLE_JSON_STRINGS } from "@/app/playground/react-polygrid/_components/input/json";
import type { GridPlugin } from "@jsoc/react-grid";
import type { GridOptions } from "@jsoc/grid-core";

import { useState, type Dispatch, type SetStateAction } from "react";

interface PlaygroundGridOptions extends GridOptions {
  name: keyof typeof SAMPLE_JSON_STRINGS;
  data: string;
}

export interface GridOptionsState {
  gridOptions: PlaygroundGridOptions;
  setGridOptions: Dispatch<SetStateAction<PlaygroundGridOptions>>;
}

export function createPlaygroundGridOptions(
  jsonName: keyof typeof SAMPLE_JSON_STRINGS,
  data?: string,
): PlaygroundGridOptions {
  return {
    data: data || SAMPLE_JSON_STRINGS[jsonName],
    name: jsonName,
  };
}

export function Playground() {
  const [gridOptions, setGridOptions] = useState(() =>
    createPlaygroundGridOptions("shoe"),
  );

  const [plugin, setPlugin] = useState<GridPlugin>("ag");

  return (
    <SplitView className="flex-1 svrow:max-h-[700px] mt-6 min-h-96">
      <SplitView.Pane>
        <SplitView.Pane.Head>
          <InputPaneHead
            gridOptions={gridOptions}
            setGridOptions={setGridOptions}
          />
        </SplitView.Pane.Head>

        <SplitView.Pane.Body>
          <InputPaneBody
            gridOptions={gridOptions}
            setGridOptions={setGridOptions}
          />
        </SplitView.Pane.Body>
      </SplitView.Pane>

      <SplitView.Pane>
        <SplitView.Pane.Head>
          <OutputPaneHead plugin={plugin} setPlugin={setPlugin} />
        </SplitView.Pane.Head>

        <SplitView.Pane.Body>
          <OutputPaneBody
            plugin={plugin}
            gridOptions={gridOptions}
            setGridOptions={setGridOptions}
          />
        </SplitView.Pane.Body>
      </SplitView.Pane>
    </SplitView>
  );
}
