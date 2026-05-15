"use client";

import {
  PlaygroundContext,
  type PlaygroundContextValue,
} from "@/contexts/PlaygroundContext";
import type { FrameworkId, PluginId } from "@jsoc/grid-docs";
import type { ReactNode } from "react";
import { useState } from "react";

export function PlaygroundContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [selectedPluginId, setSelectedPluginId] =
    useState<PluginId<FrameworkId>>("ag");
  const [selectedFrameworkId, setSelectedFrameworkId] =
    useState<FrameworkId>("react-grid");

  const value: PlaygroundContextValue = {
    selectedPluginId,
    setSelectedPluginId,
    selectedFrameworkId,
    setSelectedFrameworkId,
  };

  return (
    <PlaygroundContext.Provider value={value}>
      {children}
    </PlaygroundContext.Provider>
  );
}
