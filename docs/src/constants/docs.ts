import { getPluginIds, type AdapterId, type PluginId } from "@jsoc/grid-docs";

export type DocsParams = {
  adapterId: AdapterId;
  pluginId: PluginId<AdapterId>;
};

export const CONTENT_DIR_BASE_PATH = "/docs";

export const ADAPTER_ID_PARAM_KEY = "adapterId" satisfies keyof DocsParams;
export const PLUGIN_ID_PARAM_KEY = "pluginId" satisfies keyof DocsParams;

export const DEFAULT_ADAPTER_ID = "react-grid" satisfies AdapterId;
export const DEFAULT_PLUGIN_ID = getPluginIds(DEFAULT_ADAPTER_ID)[0];
