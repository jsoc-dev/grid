import {
  type FrameworkId,
  type PluginMetadata,
  type PluginId,
} from "@jsoc/grid-docs";
import { usePlaygroundContext } from "@/contexts/PlaygroundContext";
import clsx from "clsx";
import { getPluginIcon } from "@/assets/icons/plugins";

type Props<F extends FrameworkId> = {
  frameworkId: F;
  pluginId: PluginId<F>;
  meta: PluginMetadata;
};

export function PluginSelector<F extends FrameworkId>({
  frameworkId,
  pluginId,
  meta,
}: Props<F>) {
  const { selectedPluginId, setSelectedPluginId } = usePlaygroundContext();
  const { shortName } = meta;
  const Icon = getPluginIcon(frameworkId, pluginId);
  const isSelected = pluginId === selectedPluginId;

  return (
    <button
      onClick={() => setSelectedPluginId(pluginId)}
      className={clsx(
        "relative flex flex-col items-center gap-1.5 px-4 py-3 text-xs font-medium transition-colors shrink-0 cursor-pointer",
        isSelected
          ? "text-accent-600 dark:text-accent-400"
          : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-500 dark:hover:text-zinc-300",
      )}
    >
      {/* eslint-disable-next-line react-hooks/static-components */}
      <Icon width="22" height="22" className="shrink-0" />

      <span>{shortName}</span>

      {isSelected && (
        <span
          className={clsx(
            "hidden", // hide on small screens to avoid scrollbar collision
            "absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-accent-500 md:block",
          )}
        />
      )}
    </button>
  );
}
