"use client";

import { FileExplorerRow } from "@/components/file-explorer/FileExplorerRow";
import type { ExampleSourceFile } from "@jsoc/grid-docs";
import {
  hotkeysCoreFeature,
  selectionFeature,
  syncDataLoaderFeature,
} from "@headless-tree/core";
import { useTree } from "@headless-tree/react";

import { useEffect, useMemo, useState, useRef } from "react";

type Props = {
  files: ExampleSourceFile[];
  onSelect: (selectedFile: ExampleSourceFile) => void;
  /** File to select on mount. Falls back to `files[0]` if not provided. */
  defaultFile?: ExampleSourceFile;
};

export type FileExplorerItem = {
  id: string;
  name: string;
  children: string[];
  isFolder: boolean;
  file?: ExampleSourceFile;
};

/**
 * A generic file explorer tree panel built on headless-tree.
 * Renders a navigable tree of files and calls `onSelect` when a file row is clicked.
 * Auto-selects the first file on mount.
 */
export function FileExplorer({ files, onSelect, defaultFile }: Props) {
  const [selectedFilePath, setSelectedFilePath] = useState<string | undefined>(
    (defaultFile ?? files[0])?.path,
  );

  const fileTree = useMemo(() => buildFileTree(files), [files]);
  const pathsKey = files.map((f) => f.path).join("\n");
  const sourceItemsRef = useRef(fileTree.items);

  const treeInstance = useTree<FileExplorerItem>({
    rootItemId: fileTree.rootItemId,
    getItemName: (item) => item.getItemData().name,
    isItemFolder: (item) => item.getItemData().isFolder,
    indent: 12,
    initialState: {
      expandedItems: fileTree.expandedItems,
    },
    state: {
      selectedItems: selectedFilePath ? [selectedFilePath] : [],
    },
    dataLoader: {
      getItem: (itemId) => {
        const item = sourceItemsRef.current.get(itemId);

        if (!item) {
          throw new Error(`Missing file explorer item: ${itemId}`);
        }

        return item;
      },
      getChildren: (itemId) =>
        sourceItemsRef.current.get(itemId)?.children ?? [],
    },
    features: [syncDataLoaderFeature, selectionFeature, hotkeysCoreFeature],
  });

  // Rebuild tree when files change, preserving user's expanded state while expanding new folders
  useEffect(() => {
    // Update the ref inside the effect so the interim render uses old data and doesn't crash
    sourceItemsRef.current = fileTree.items;

    treeInstance.setState((previous) => {
      const mergedExpandedItems = new Set([
        ...(previous.expandedItems ?? []),
        ...fileTree.expandedItems,
      ]);
      return {
        ...previous,
        expandedItems: Array.from(mergedExpandedItems),
      };
    });
    treeInstance.rebuildTree();
  }, [pathsKey, fileTree.expandedItems, fileTree.items, treeInstance]);

  // Auto-select the default (or first) file on mount / when files change
  useEffect(() => {
    const defaultFileExists =
      defaultFile && files.some((f) => f.path === defaultFile.path);
    const fileToSelect = defaultFileExists ? defaultFile : files[0];

    if (fileToSelect) {
      setSelectedFilePath(fileToSelect.path);
      onSelect(fileToSelect);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathsKey]);

  const handleSelectFile = (file: ExampleSourceFile) => {
    setSelectedFilePath(file.path);
    onSelect(file);
  };

  return (
    <div {...treeInstance.getContainerProps("Source files")} className="p-1">
      {treeInstance.getItems().map((item) => (
        <FileExplorerRow
          key={item.getId()}
          item={item}
          onSelectFile={handleSelectFile}
        />
      ))}
    </div>
  );
}

/**
 * Builds a headless tree data structure from a list of ExampleSourceFiles.
 * Folders are auto-expanded; siblings are sorted folders-first then alphabetically.
 */
function buildFileTree(files: ExampleSourceFile[]) {
  const rootItemId = "__source_root__";
  const items = new Map<string, FileExplorerItem>([
    [
      rootItemId,
      {
        id: rootItemId,
        name: "root",
        children: [],
        isFolder: true,
      },
    ],
  ]);

  // Index files by path for O(1) lookup when attaching to leaf nodes
  const fileByPath = new Map<string, ExampleSourceFile>(
    files.map((f) => [f.path, f]),
  );

  const expandedItems = new Set<string>();

  for (const { path } of files) {
    const segments = path.split("/");
    let parentId = rootItemId;
    let currentPath = "";

    for (const [index, segment] of segments.entries()) {
      currentPath = currentPath ? `${currentPath}/${segment}` : segment;
      const isFolder = index < segments.length - 1;

      if (!items.has(currentPath)) {
        items.set(currentPath, {
          id: currentPath,
          name: segment,
          children: [],
          isFolder,
          file: isFolder ? undefined : fileByPath.get(currentPath),
        });
      }

      const parent = items.get(parentId);
      if (parent && !parent.children.includes(currentPath)) {
        parent.children.push(currentPath);
      }

      if (isFolder) {
        expandedItems.add(currentPath);
      }

      parentId = currentPath;
    }
  }

  // Sort each node's children: folders first, then alphabetically
  for (const item of items.values()) {
    item.children.sort((leftId, rightId) => {
      const left = items.get(leftId);
      const right = items.get(rightId);

      if (!left || !right) {
        return leftId.localeCompare(rightId);
      }

      if (left.isFolder !== right.isFolder) {
        return left.isFolder ? -1 : 1;
      }

      return left.name.localeCompare(right.name);
    });
  }

  return {
    rootItemId,
    items,
    expandedItems: [...expandedItems],
  };
}
