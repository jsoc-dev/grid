"use client";

import { PanelHeader } from "@/components/playground/panel/PanelHeader";
import { shoeJSON } from "@jsoc/grid-examples-shared";
import { useSetLocalJSON } from "@jsoc/react-grid-examples";
import { encodePretty } from "@jsoc/utils";
import Editor from "@monaco-editor/react";
import clsx from "clsx";
import { useTheme } from "next-themes";
import { RotateCcw } from "lucide-react";
import { useState, useEffect } from "react";

const DEFAULT_DATA = encodePretty(shoeJSON);

export function InputPanel() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<string | undefined>(DEFAULT_DATA);
  useSetLocalJSON(data);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return (
    <div className="flex-1 flex flex-col min-h-0 relative gap-3">
      <PanelHeader heading="JSON Editor">
        <PanelHeader.Button
          label="Reset"
          Icon={RotateCcw}
          disabled={data === DEFAULT_DATA}
          onClick={() => setData(DEFAULT_DATA)}
        />
      </PanelHeader>

      <div
        className={clsx(
          "flex-1 min-h-0 rounded-xl border overflow-hidden transition-colors border-zinc-300",
          "dark:border-zinc-600/50",
        )}
      >
        {mounted && (
          <Editor
            height="100%"
            defaultLanguage="json"
            value={data}
            theme={resolvedTheme === "dark" ? "vs-dark" : "light"}
            onChange={(val) => {
              setData(val);
            }}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              fontFamily: "var(--font-mono)",
              lineNumbers: "on",
              scrollBeyondLastLine: false,
              automaticLayout: true,
              padding: { top: 16, bottom: 16 },
              tabSize: 2,
              fixedOverflowWidgets: true,
            }}
          />
        )}
      </div>
    </div>
  );
}
