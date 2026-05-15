"use client";

import type { FrameworkId, PluginId } from "@jsoc/grid-docs";
import {
  createContext,
  useContext,
  type Dispatch,
  type SetStateAction,
} from "react";

export type RootContextValue = {
  selectedFrameworkId: FrameworkId;
  setSelectedFrameworkId: Dispatch<SetStateAction<FrameworkId>>;
  selectedPluginId: PluginId<FrameworkId>;
  setSelectedPluginId: Dispatch<SetStateAction<PluginId<FrameworkId>>>;
};

export const RootContext = createContext<RootContextValue | null>(null);

export function useRootContext() {
  const ctx = useContext(RootContext);

  if (!ctx) {
    throw new Error("useRootContext must be used within RootContextProvider");
  }

  return ctx;
}
