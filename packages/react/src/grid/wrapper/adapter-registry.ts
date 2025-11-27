import { ExtractProps } from "@/utils";
import { JsocGridAg, JsocGridMui } from "@/grid";
import { SpreadableObject } from "@jsoc/core";

export const GRID_UI_ADAPTERS = {
    mui: JsocGridMui,
    ag: JsocGridAg,
} as const;

export type GridUiAdapterName = Extract<keyof typeof GRID_UI_ADAPTERS, string>;

export type GridUiAdapterComponent<U extends GridUiAdapterName> =
    (typeof GRID_UI_ADAPTERS)[U];

export type GridUiAdapterComponentProps<U extends GridUiAdapterName> =
    SpreadableObject<ExtractProps<GridUiAdapterComponent<U>>>;