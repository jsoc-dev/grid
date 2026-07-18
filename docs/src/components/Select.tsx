import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import clsx from "clsx";
import { ChevronsUpDown, Check } from "lucide-react";
import { Fragment, type ReactNode } from "react";

export type SelectOption<V extends string> = {
  id: V;
  title: string;
  subtitle?: string;
  icon: ReactNode;
};

type Props<V extends string> = {
  value: V;
  options: SelectOption<V>[];
  onChange: (value: V) => void;
  title: string;
  disabled?: boolean;
};

export function Select<V extends string>({
  value,
  options,
  onChange,
  title,
  disabled,
}: Props<V>) {
  const selected = options.find((option) => option.id === value) ?? options[0];

  return (
    <Listbox value={value} onChange={onChange} disabled={disabled}>
      {/* trigger to open the dropdown */}
      <ListboxButton
        title={title}
        className={clsx(
          "flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-left outline-none",
          disabled
            ? "cursor-not-allowed opacity-50"
            : "cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-800",
        )}
      >
        <span className="flex size-5 shrink-0 items-center justify-center">
          {selected.icon}
        </span>

        <span className="flex min-w-0 flex-1 flex-col items-start">
          <span className="max-w-full select-none truncate text-sm font-medium text-gray-900 dark:text-gray-50">
            {selected.title}
          </span>

          {selected.subtitle ? (
            <span className="max-w-full select-none truncate text-xs font-normal text-gray-500 dark:text-gray-400">
              {selected.subtitle}
            </span>
          ) : null}
        </span>

        <ChevronsUpDown
          aria-hidden
          className="ml-auto size-3.5 shrink-0 text-gray-400 "
        />
      </ListboxButton>

      {/* dropdown options */}
      <ListboxOptions
        anchor={{ to: "bottom start", gap: 4 }}
        as="ul"
        className={clsx(
          "z-30 max-h-64 min-w-(--button-width) overflow-auto outline-none",
          "rounded-md border border-gray-200 bg-white text-sm shadow-sm",
          "dark:border-white/20 dark:bg-neutral-900",
        )}
      >
        {options.map((option) => (
          <ListboxOption key={option.id} as={Fragment} value={option.id}>
            {({ focus, selected: isSelected }) => (
              <li
                className={clsx(
                  "flex cursor-pointer items-center gap-2.5 px-2 py-2",
                  focus
                    ? "bg-gray-100 dark:bg-neutral-800"
                    : "text-gray-800 dark:text-gray-100",
                )}
              >
                <span className="flex size-5 shrink-0 items-center justify-center">
                  {option.icon}
                </span>

                <span className="flex min-w-0 flex-1 flex-col items-start">
                  <span className="max-w-full select-none truncate text-sm font-medium">
                    {option.title}
                  </span>

                  {option.subtitle ? (
                    <span className="max-w-full select-none truncate text-xs text-gray-500 dark:text-gray-400">
                      {option.subtitle}
                    </span>
                  ) : null}
                </span>

                {isSelected ? (
                  <Check className="ml-auto size-4 shrink-0 text-accent-600" />
                ) : null}
              </li>
            )}
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  );
}

export function SelectSkeleton() {
  return (
    <div className="flex w-full items-center gap-2.5 rounded-md px-2 py-2">
      <div className="size-5 shrink-0 animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-800"></div>
      <div className="h-4 flex-1 animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-800"></div>
      <ChevronsUpDown
        aria-hidden
        className="ml-auto size-3.5 shrink-0 text-gray-400"
      />
    </div>
  );
}
