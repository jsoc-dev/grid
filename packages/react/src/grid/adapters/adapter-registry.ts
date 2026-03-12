import { JsocGridAg } from "#grid/adapters/ag/JsocGridAg.tsx";
import { JsocGridMui } from "#grid/adapters/mui/JsocGridMui.tsx";
import type { ComponentProps } from "react";

export const GRID_UI_ADAPTERS = {
  mui: JsocGridMui,
  ag: JsocGridAg,
} as const;

export type GridUiAdapterName = Extract<keyof typeof GRID_UI_ADAPTERS, string>;

export type GridUiAdapterComponent<U extends GridUiAdapterName> =
  (typeof GRID_UI_ADAPTERS)[U];

export type GridUiAdapterComponentProps<U extends GridUiAdapterName> =
  ComponentProps<GridUiAdapterComponent<U>>;
