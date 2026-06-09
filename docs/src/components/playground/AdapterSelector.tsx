"use client";

import { getAdapterIcon } from "@/assets/icons/adapters";
import { usePlaygroundContext } from "@/contexts/PlaygroundContext";
import {
  getAdapterMetadata,
  getPluginIds,
  type AdapterId,
} from "@jsoc/grid-docs";
import clsx from "clsx";

type Props = {
  adapterId: AdapterId;
};

export function AdapterSelector({ adapterId }: Props) {
  const { selectedAdapterId, setSelectedAdapterId, setSelectedPluginId } =
    usePlaygroundContext();
  const { name } = getAdapterMetadata(adapterId);
  const Icon = getAdapterIcon(adapterId);
  const isSelected = adapterId === selectedAdapterId;

  return (
    <button
      onClick={() => {
        setSelectedAdapterId(adapterId);
        setSelectedPluginId(getPluginIds(adapterId)[0]);
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
