"use client";

import type { AdapterId, PluginId } from "@jsoc/grid-docs";
import {
  createContext,
  useContext,
  type Dispatch,
  type SetStateAction,
} from "react";

export type PlaygroundContextValue = {
  selectedAdapterId: AdapterId;
  setSelectedAdapterId: Dispatch<SetStateAction<AdapterId>>;
  selectedPluginId: PluginId<AdapterId>;
  setSelectedPluginId: Dispatch<SetStateAction<PluginId<AdapterId>>>;
};

export const PlaygroundContext = createContext<PlaygroundContextValue | null>(
  null,
);

export function usePlaygroundContext() {
  const ctx = useContext(PlaygroundContext);

  if (!ctx) {
    throw new Error(
      "usePlaygroundContext must be used within PlaygroundContextProvider",
    );
  }

  return ctx;
}
