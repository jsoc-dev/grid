import { useCodeExplorerContext } from "@/components/code-explorer/CE_ContextProvider";
import type { SetState } from "@/types/react";
import {
  findSuitableDefaultFile,
  type ExampleSourceFile,
} from "@jsoc/grid-docs";
import { createContext, useContext, useState, type ReactNode } from "react";

export type CodeExplorerSelectionContextType = {
  files: ExampleSourceFile[];
  selectedFile: ExampleSourceFile;
  setSelectedFile: SetState<ExampleSourceFile>;
};

const CodeExplorerSelectionContext =
  createContext<CodeExplorerSelectionContextType | null>(null);

export function CE_SelectionContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { source, adapterId, pluginId, exampleId } = useCodeExplorerContext();

  const { isPending, isError, data } = source;

  if (isPending || isError) return children;

  return (
    <CE_SelectionContextProviderInner
      key={adapterId + pluginId + exampleId}
      files={data}
    >
      {children}
    </CE_SelectionContextProviderInner>
  );
}

function CE_SelectionContextProviderInner({
  files,
  children,
}: {
  files: ExampleSourceFile[];
  children: ReactNode;
}) {
  const { exampleId, languagePreference } = useCodeExplorerContext();

  const [selectedFile, setSelectedFile] = useState(() =>
    findSuitableDefaultFile(files, exampleId, languagePreference),
  );

  const value: CodeExplorerSelectionContextType = {
    files,
    selectedFile,
    setSelectedFile,
  };

  return (
    <CodeExplorerSelectionContext.Provider value={value}>
      {children}
    </CodeExplorerSelectionContext.Provider>
  );
}

export function useCodeExplorerSelectionContext() {
  return useContext(CodeExplorerSelectionContext);
}
