"use client";

import { getPluginIcon } from "@/icons/plugins";
import {
  getPluginIds,
  getPluginMetadata,
  type PluginId,
} from "@jsoc/grid-docs";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import clsx from "clsx";
import { Check, ChevronDown } from "lucide-react";
import { Fragment } from "react";

export type ReactGridPluginId = PluginId<"react-grid">;

const PLUGIN_OPTIONS = getPluginIds("react-grid").map((pluginId) => {
  const metadata = getPluginMetadata("react-grid", pluginId);
  const Icon = getPluginIcon("react-grid", pluginId);
  return {
    id: pluginId,
    name: metadata.name,
    icon: <Icon className="size-3.5 shrink-0" />,
  };
});

export type DemoPluginSelectProps = {
  value: ReactGridPluginId;
  onChange: (value: ReactGridPluginId) => void;
};

export function DemoPluginSelect({ value, onChange }: DemoPluginSelectProps) {
  const current =
    PLUGIN_OPTIONS.find((p) => p.id === value) ?? PLUGIN_OPTIONS[0];

  return (
    <Listbox value={value} onChange={onChange}>
      <div className="relative inline-block text-left">
        <ListboxButton className="flex cursor-pointer items-center gap-1.5 rounded border border-neutral-200 bg-panel-surface px-2 py-0.5 text-xs font-normal text-neutral-700 transition-colors hover:border-neutral-300 hover:text-neutral-900 focus:outline-none dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-neutral-600 dark:hover:text-white">
          {current.icon}
          <span className="font-medium">{current.name}</span>
          <ChevronDown className="size-3 text-neutral-400" />
        </ListboxButton>

        <ListboxOptions
          anchor={{ to: "bottom end", gap: 4 }}
          className="z-50 min-w-48 overflow-hidden rounded-md border border-panel-outline bg-panel-surface p-1 text-xs shadow-lg outline-none"
        >
          {PLUGIN_OPTIONS.map((plugin) => (
            <ListboxOption key={plugin.id} as={Fragment} value={plugin.id}>
              {({ focus, selected }) => (
                <li
                  className={clsx(
                    "flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 transition-colors",
                    focus
                      ? "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100"
                      : "text-neutral-700 dark:text-neutral-300",
                  )}
                >
                  {plugin.icon}
                  <span className="flex-1 truncate font-medium">
                    {plugin.name}
                  </span>
                  {selected && (
                    <Check className="size-3.5 shrink-0 text-accent-600 dark:text-accent-400" />
                  )}
                </li>
              )}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  );
}
