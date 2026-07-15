import type { CodeLanguage } from "@jsoc/grid-docs";
import {
  getIconForFile,
  getIconForFolder,
  getIconForOpenFolder,
} from "vscode-icons-js";
import { ICON_MAP } from "@/icons/file-icons";

const LANGUAGE_TO_EXTENSION: Partial<Record<CodeLanguage, string>> = {
  javascript: "js",
  typescript: "ts",
  jsx: "jsx",
  tsx: "tsx",
  css: "css",
  html: "html",
  json: "json",
  vue: "vue",
};

export function resolveIcon(
  name: string,
  options?: {
    isFolder?: boolean;
    expanded?: boolean;
  },
) {
  if (options?.isFolder) {
    return options.expanded
      ? getIconForOpenFolder(name)
      : getIconForFolder(name);
  }

  return getIconForFile(name);
}

type Props = {
  language?: CodeLanguage;
  name?: string;
  isFolder?: boolean;
  expanded?: boolean;
  size?: number;
};

export function FileIcon({
  language,
  name,
  isFolder = false,
  expanded = false,
  size = 16,
}: Props) {
  let fileName = name;

  if (!fileName && language) {
    const ext = LANGUAGE_TO_EXTENSION[language] || "txt";
    fileName = `file.${ext}`;
  }

  const iconName = fileName
    ? resolveIcon(fileName, { isFolder, expanded })
    : "default_file.svg";

  let Icon = iconName ? ICON_MAP[iconName] : undefined;

  if (!Icon) {
    if (isFolder) {
      Icon = expanded
        ? ICON_MAP["default_folder_opened.svg"]
        : ICON_MAP["default_folder.svg"];
    } else {
      Icon = ICON_MAP["default_file.svg"];
    }
  }

  return (
    <Icon
      width={size}
      height={size}
      style={{
        flexShrink: 0,
        userSelect: "none",
      }}
    />
  );
}
