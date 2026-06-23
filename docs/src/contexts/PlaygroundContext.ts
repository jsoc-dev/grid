"use client";

import type { AdapterId, PluginId } from "@jsoc/grid-docs";
import { createContext, type Dispatch, type SetStateAction } from "react";

export type PlaygroundContextValue = {
  selectedAdapterId: AdapterId;
  setSelectedAdapterId: Dispatch<SetStateAction<AdapterId>>;
  selectedPluginId: PluginId<AdapterId>;
  setSelectedPluginId: Dispatch<SetStateAction<PluginId<AdapterId>>>;
};

export const PlaygroundContext = createContext<PlaygroundContextValue | null>(
  null,
);
