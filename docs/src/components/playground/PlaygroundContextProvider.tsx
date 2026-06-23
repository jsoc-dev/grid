"use client";

import { PlaygroundContext } from "@/contexts/PlaygroundContext";
import type { AdapterId, PluginId } from "@jsoc/grid-docs";
import type { ReactNode } from "react";
import { useState } from "react";

export function PlaygroundContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [selectedPluginId, setSelectedPluginId] =
    useState<PluginId<AdapterId>>("ag");
  const [selectedAdapterId, setSelectedAdapterId] =
    useState<AdapterId>("react-grid");

  const ctx = {
    selectedPluginId,
    setSelectedPluginId,
    selectedAdapterId,
    setSelectedAdapterId,
  };

  return (
    <PlaygroundContext.Provider value={ctx}>
      {children}
    </PlaygroundContext.Provider>
  );
}
