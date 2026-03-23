import { HeadLayout } from "@/playground/react-polygrid/_components/shared";
import type { NonHeadlessPlugins } from "@/playground/react-polygrid/Playground";

import type { Dispatch, SetStateAction } from "react";

const AVAILABLE_PLUGINS: {
  [P in NonHeadlessPlugins]: string;
} = {
  ag: "AG-Grid",
  mantine: "Mantine",
  mui: "MUI X",
};

const AVAILABLE_PLUGINS_LIST = Object.entries(AVAILABLE_PLUGINS) as [
  NonHeadlessPlugins,
  string,
][];

type Props = {
  plugin: NonHeadlessPlugins;
  setPlugin: Dispatch<SetStateAction<NonHeadlessPlugins>>;
};

export function OutputPaneHead({ plugin: currentPlugin, setPlugin }: Props) {
  return (
    <HeadLayout heading="PLUGIN">
      <div className="flex gap-3">
        {AVAILABLE_PLUGINS_LIST.map(([plugin, pluginName]) => (
          <button
            className={getSelectedCls(plugin)}
            key={plugin}
            onClick={() => onPluginOptionClick(plugin)}
          >
            {/* TODO: Show library icon also */}
            <span className="inline-block w-max">{pluginName}</span>
          </button>
        ))}
      </div>
    </HeadLayout>
  );

  function onPluginOptionClick(plugin: NonHeadlessPlugins) {
    setPlugin(plugin);
  }

  function getSelectedCls(plugin: NonHeadlessPlugins): string {
    return plugin === currentPlugin
      ? "text-primary font-medium"
      : "text-muted-foreground hover:text-foreground transition-colors";
  }
}
