"use client";

import { getFrameworkIcon } from "@/assets/icons/frameworks";
import { usePlaygroundContext } from "@/contexts/PlaygroundContext";
import {
  getFrameworkMetadata,
  getPluginIds,
  type FrameworkId,
} from "@jsoc/grid-docs";
import clsx from "clsx";

type Props = {
  frameworkId: FrameworkId;
};

export function FrameworkSelector({ frameworkId }: Props) {
  const { selectedFrameworkId, setSelectedFrameworkId, setSelectedPluginId } =
    usePlaygroundContext();
  const { name } = getFrameworkMetadata(frameworkId);
  const Icon = getFrameworkIcon(frameworkId);
  const isSelected = frameworkId === selectedFrameworkId;

  return (
    <button
      onClick={() => {
        setSelectedFrameworkId(frameworkId);
        setSelectedPluginId(getPluginIds(frameworkId)[0]);
      }}
      className={clsx(
        "relative flex flex-col items-center gap-1.5 px-4 py-3 text-xs font-medium transition-colors shrink-0 cursor-pointer",
        isSelected
          ? "text-accent-600 dark:text-accent-400"
          : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-500 dark:hover:text-zinc-300",
      )}
    >
      {/* eslint-disable-next-line react-hooks/static-components */}
      <Icon width="22" height="22" className="shrink-0" />

      <span>{name}</span>

      {isSelected && (
        <span
          className={clsx(
            "hidden",
            "absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-accent-500 md:block",
          )}
        />
      )}
    </button>
  );
}
