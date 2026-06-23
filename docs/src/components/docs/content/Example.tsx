"use client";

import {
  ExamplePreview,
  type ExamplePreviewRendererParams,
} from "@/components/ExamplePreview";
import { ADAPTER_ID_PARAM_KEY, PLUGIN_ID_PARAM_KEY } from "@/constants/docs";
import { useDocsParams } from "@/hooks/useDocsParams";
import type { ExampleId, AdapterId, PluginId } from "@jsoc/grid-docs";
import clsx from "clsx";
import { useState, type Dispatch, type SetStateAction } from "react";

type Props = {
  exampleId: ExampleId<AdapterId, PluginId<AdapterId>>;
};

export function Example({ exampleId }: Props) {
  const [showCode, setShowCode] = useState(false);
  const docsParams = useDocsParams();

  return (
    <div className="flex flex-col gap-4">
      <ExamplePreview
        className="h-48!"
        adapterId={docsParams[ADAPTER_ID_PARAM_KEY]}
        pluginId={docsParams[PLUGIN_ID_PARAM_KEY]}
        exampleId={exampleId}
      >
        {(rendererParams) => {
          return (
            <>
              {rendererParams.preview}
              <ExampleControls
                showCode={showCode}
                setShowCode={setShowCode}
                rendererParams={rendererParams}
              />
              {showCode && <CodeExplorer />}
            </>
          );
        }}
      </ExamplePreview>
    </div>
  );
}

function CodeExplorer() {
  return (
    <div className="flex-1 h-24 flex items-center justify-center border rounded-2xl">
      Code Not Available
    </div>
  );
}

function ExampleControls({
  showCode,
  setShowCode,
  rendererParams,
}: {
  showCode: boolean;
  setShowCode: Dispatch<SetStateAction<boolean>>;
  rendererParams: ExamplePreviewRendererParams;
}) {
  const { isPending } = rendererParams;
  const disableButtons = !!(isPending || rendererParams.error);
  const reload = disableButtons ? undefined : rendererParams.reload;
  const openInNewTab = disableButtons ? undefined : rendererParams.openInNewTab;

  const buttons = [
    {
      action: () => setShowCode(!showCode),
      text: showCode ? "Hide Code" : "Show Code",
    },
    {
      action: reload,
      text: "Reload",
      disabled: disableButtons,
    },
    {
      action: openInNewTab,
      text: "Open in New Tab",
      disabled: disableButtons,
    },
  ];

  return (
    <div className="flex justify-end gap-4">
      {buttons.map((button, index) => (
        <button
          key={index}
          onClick={button.action}
          disabled={button.disabled}
          className={clsx(
            "border rounded-2xl px-4 py-2 cursor-pointer",
            button.disabled && "cursor-not-allowed",
          )}
        >
          {button.text}
        </button>
      ))}
    </div>
  );
}
