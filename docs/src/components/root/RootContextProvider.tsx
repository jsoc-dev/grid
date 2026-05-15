"use client";

import { RootContext, type RootContextValue } from "@/contexts/RootContext";
import type { FrameworkId, PluginId } from "@jsoc/grid-docs";
import type { ReactNode } from "react";
import { useState } from "react";

export function RootContextProvider({ children }: { children: ReactNode }) {
  const [selectedPluginId, setSelectedPluginId] =
    useState<PluginId<"react-grid">>("ag");
  const [selectedFrameworkId, setSelectedFrameworkId] =
    useState<FrameworkId>("react-grid");

  const rootContextValue: RootContextValue = {
    selectedPluginId,
    setSelectedPluginId,
    selectedFrameworkId,
    setSelectedFrameworkId,
  };

  return (
    <RootContext.Provider value={rootContextValue}>
      {children}
    </RootContext.Provider>
  );
}
