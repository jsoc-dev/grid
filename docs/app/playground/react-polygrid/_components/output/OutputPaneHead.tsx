import { HeadLayout } from "@/app/playground/react-polygrid/_components/shared";
import type { GridPlugin } from "@jsoc/react-grid";
import type { Dispatch, SetStateAction } from "react";

const pluginOptions: [GridPlugin, string][] = [
  ["ag", "AG-Grid"],
  ["mui", "MUI X"],
];

type Props = {
  plugin: GridPlugin;
  setPlugin: Dispatch<SetStateAction<GridPlugin>>;
};

export function OutputPaneHead({ plugin, setPlugin }: Props) {
  return (
    <HeadLayout heading="PLUGIN">
      <div className="flex gap-3">
        {pluginOptions.map(([pluginKey, pluginName]) => (
          <button
            className={`${getSelectedCls(pluginKey)} `}
            key={pluginKey}
            onClick={() => onPluginOptionClick(pluginKey)}
          >
            {/* TODO: Show library icon also */}
            <span className="inline-block w-max">{pluginName}</span>
          </button>
        ))}
      </div>
    </HeadLayout>
  );

  function onPluginOptionClick(selectedPluginOption: GridPlugin) {
    setPlugin(selectedPluginOption);
  }

  function getSelectedCls(pluginOption: GridPlugin): string {
    return pluginOption === plugin
      ? "text-primary font-medium"
      : "text-muted-foreground hover:text-foreground transition-colors";
  }
}
