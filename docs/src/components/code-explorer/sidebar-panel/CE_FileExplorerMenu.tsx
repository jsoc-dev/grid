import { useCodeExplorerContext } from "@/components/code-explorer/CodeExplorerContext";
import { Menu, MenuButton, MenuItems } from "@headlessui/react";
import { MoreHorizontal } from "lucide-react";
import { MenuItemCheckbox } from "@/components/code-explorer/shared/MenuItemCheckbox";

type Props = {
  showOtherFiles: boolean;
  setShowOtherFiles: (value: boolean) => void;
};

export function CE_FileExplorerMenu({
  showOtherFiles,
  setShowOtherFiles,
}: Props) {
  const { languagePreference, setLanguagePreference } =
    useCodeExplorerContext();

  return (
    <div className="flex h-10 shrink-0 items-center justify-between px-2">
      <span className="text-xs text-neutral-500 dark:text-neutral-400 select-none uppercase tracking-wider">
        Explorer
      </span>

      <Menu>
        <MenuButton
          className="cursor-pointer rounded-md p-1 text-neutral-400 transition-colors hover:bg-neutral-200/70 hover:text-neutral-700 dark:text-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-neutral-300 outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          title="Views and More Actions"
        >
          <MoreHorizontal className="h-4 w-4" />
        </MenuButton>

        <MenuItems
          anchor={{ to: "bottom start", gap: 4 }}
          className="z-50 min-w-48 bg-panel-surface border border-panel-outline rounded-md shadow-lg p-1 outline-none text-xs text-neutral-700 dark:text-neutral-300"
        >
          <MenuItemCheckbox
            selected={languagePreference === "javascript"}
            onClick={() => setLanguagePreference("javascript")}
          >
            Javascript
          </MenuItemCheckbox>

          <MenuItemCheckbox
            selected={languagePreference === "typescript"}
            onClick={() => setLanguagePreference("typescript")}
          >
            Typescript
          </MenuItemCheckbox>

          <div className="h-px bg-panel-outline my-1 mx-1" />

          <MenuItemCheckbox
            selected={showOtherFiles}
            onClick={() => setShowOtherFiles(!showOtherFiles)}
          >
            Show other example files
          </MenuItemCheckbox>
        </MenuItems>
      </Menu>
    </div>
  );
}
