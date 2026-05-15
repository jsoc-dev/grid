"use client";

import type { FrameworkId, PluginId } from "@jsoc/grid-docs";
import {
  createContext,
  useContext,
  type Dispatch,
  type SetStateAction,
} from "react";

export type PlaygroundContextValue = {
  selectedFrameworkId: FrameworkId;
  setSelectedFrameworkId: Dispatch<SetStateAction<FrameworkId>>;
  selectedPluginId: PluginId<FrameworkId>;
  setSelectedPluginId: Dispatch<SetStateAction<PluginId<FrameworkId>>>;
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
