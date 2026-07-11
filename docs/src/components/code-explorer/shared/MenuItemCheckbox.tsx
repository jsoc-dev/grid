import { MenuItem } from "@headlessui/react";
import { Check } from "lucide-react";
import clsx from "clsx";

export function MenuItemCheckbox({
  selected,
  onClick,
  children,
}: {
  selected?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <MenuItem>
      {({ focus }) => (
        <button
          onClick={onClick}
          className={clsx(
            "flex items-center w-full px-2 py-1.5 rounded-sm cursor-pointer",
            focus && "bg-neutral-100 dark:bg-neutral-800",
          )}
        >
          <span className="w-4 mr-2 flex justify-center">
            {selected && <Check className="w-3.5 h-3.5" />}
          </span>
          {children}
        </button>
      )}
    </MenuItem>
  );
}
