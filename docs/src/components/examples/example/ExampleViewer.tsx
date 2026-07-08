"use client";

import { ExamplePreview } from "@/components/ExamplePreview";
import { CodeExplorer } from "@/components/code-explorer/CodeExplorer";
import { ExamplePreviewWindow } from "@/components/examples/example/ExamplePreviewWindow";
import { Panel, Group, Separator } from "react-resizable-panels";
import { GripVertical } from "lucide-react";

import {
  type ExampleLocator,
  type AdapterId,
  type PluginId,
} from "@jsoc/grid-docs";

type Props<A extends AdapterId, P extends PluginId<A>> = ExampleLocator<A, P>;

export function ExampleViewer<A extends AdapterId, P extends PluginId<A>>({
  adapterId,
  pluginId,
  exampleId,
}: Props<A, P>) {
  return (
    <Group
      className="flex flex-1 min-h-0 w-full overflow-hidden"
      defaultLayout={{ code: 50, preview: 50 }}
      orientation="horizontal"
    >
      <Panel id="code" minSize={0}>
        <div className="h-full min-w-0 min-h-0">
          <CodeExplorer {...{ adapterId, pluginId, exampleId }} />
        </div>
      </Panel>

      <Separator className="bg-transparent relative flex w-4 items-center justify-center select-none outline-none z-10 ">
        <GripVertical />
      </Separator>

      <Panel id="preview" minSize={0}>
        <div className="flex h-full">
          <ExamplePreview.Provider {...{ adapterId, pluginId, exampleId }}>
            <ExamplePreviewWindow />
          </ExamplePreview.Provider>
        </div>
      </Panel>
    </Group>
  );
}
