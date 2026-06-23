"use client";

import { PlaygroundContext } from "@/contexts/PlaygroundContext";
import { useContext } from "react";

export function usePlaygroundContext() {
  const ctx = useContext(PlaygroundContext);

  if (!ctx) {
    throw new Error(
      "usePlaygroundContext must be used within PlaygroundContextProvider",
    );
  }

  return ctx;
}
