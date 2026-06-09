"use client";

import { RootContext, type RootContextValue } from "@/contexts/RootContext";
import type { AdapterId, PluginId } from "@jsoc/grid-docs";
import type { ReactNode } from "react";
import { useState } from "react";

export function RootContextProvider({ children }: { children: ReactNode }) {
  const [selectedPluginId, setSelectedPluginId] =
    useState<PluginId<"react-grid">>("ag");
  const [selectedAdapterId, setSelectedAdapterId] =
    useState<AdapterId>("react-grid");

  const rootContextValue: RootContextValue = {
    selectedPluginId,
    setSelectedPluginId,
    selectedAdapterId,
    setSelectedAdapterId,
  };

  return (
    <RootContext.Provider value={rootContextValue}>
      {children}
    </RootContext.Provider>
  );
}
