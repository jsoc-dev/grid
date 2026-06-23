import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import clsx from "clsx";
import { ChevronsUpDown, Check } from "lucide-react";
import { Fragment, type ReactNode } from "react";

export type SelectOption = {
  id: string;
  title: string;
  subtitle?: string;
  icon: ReactNode;
};

type Props = {
  value: string;
  options: SelectOption[];
  onChange: (id: string) => void;
  title: string;
};

export function Select({ value, options, onChange, title }: Props) {
  const selected = options.find((option) => option.id === value) ?? options[0];

  return (
    <Listbox value={value} onChange={onChange}>
      {/* trigger to open the dropdown */}
      <ListboxButton
        title={title}
        className="flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2 py-2 text-left outline-none hover:bg-gray-100 dark:hover:bg-neutral-800"
      >
        <span className="flex size-5 shrink-0 items-center justify-center">
          {selected.icon}
        </span>

        <span className="flex min-w-0 flex-1 flex-col items-start">
          <span className="max-w-full truncate text-sm font-medium text-gray-900 dark:text-gray-50">
            {selected.title}
          </span>

          {selected.subtitle ? (
            <span className="max-w-full truncate text-xs font-normal text-gray-500 dark:text-gray-400">
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
                  <span className="max-w-full truncate text-sm font-medium">
                    {option.title}
                  </span>

                  {option.subtitle ? (
                    <span className="max-w-full truncate text-xs text-gray-500 dark:text-gray-400">
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
