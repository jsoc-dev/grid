"use client";

import type { AdapterId, PluginId } from "@jsoc/grid-docs";
import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useState,
  useContext,
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

export function usePlaygroundContext() {
  const ctx = useContext(PlaygroundContext);

  if (!ctx) {
    throw new Error(
      "usePlaygroundContext must be used within PlaygroundContextProvider",
    );
  }

  return ctx;
}
