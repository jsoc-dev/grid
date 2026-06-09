"use client";

import type { AdapterId, PluginId } from "@jsoc/grid-docs";
import {
  createContext,
  useContext,
  type Dispatch,
  type SetStateAction,
} from "react";

export type RootContextValue = {
  selectedAdapterId: AdapterId;
  setSelectedAdapterId: Dispatch<SetStateAction<AdapterId>>;
  selectedPluginId: PluginId<AdapterId>;
  setSelectedPluginId: Dispatch<SetStateAction<PluginId<AdapterId>>>;
};

export const RootContext = createContext<RootContextValue | null>(null);

export function useRootContext() {
  const ctx = useContext(RootContext);

  if (!ctx) {
    throw new Error("useRootContext must be used within RootContextProvider");
  }

  return ctx;
}
