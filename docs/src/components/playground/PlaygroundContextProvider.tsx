"use client";

import {
  PlaygroundContext,
  type PlaygroundContextValue,
} from "@/contexts/PlaygroundContext";
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

  const value: PlaygroundContextValue = {
    selectedPluginId,
    setSelectedPluginId,
    selectedAdapterId,
    setSelectedAdapterId,
  };

  return (
    <PlaygroundContext.Provider value={value}>
      {children}
    </PlaygroundContext.Provider>
  );
}
