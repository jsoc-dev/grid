import { createContext, useContext, ReactNode } from "react";
import type { ExampleSourceFile, LanguagePreference } from "@jsoc/grid-docs";
import type { AdapterId, ExampleId, PluginId } from "@jsoc/grid-docs";
import type { SetState } from "@/types/react";

export type CodeExplorerContextType<
  A extends AdapterId,
  P extends PluginId<A>,
> = {
  files: ExampleSourceFile[];
  selectedFile: ExampleSourceFile;
  setSelectedFile: SetState<ExampleSourceFile>;
  languagePreference: LanguagePreference;
  setLanguagePreference: SetState<LanguagePreference>;
  adapterId: A;
  pluginId: P;
  exampleId: ExampleId<A, P>;
};

const CodeExplorerContext = createContext<unknown>(null);

export function useCodeExplorerContext<
  A extends AdapterId = AdapterId,
  P extends PluginId<A> = PluginId<A>,
>() {
  const context = useContext(CodeExplorerContext);
  if (!context) {
    throw new Error(
      "useCodeExplorerContext must be used within a CodeExplorerProvider",
    );
  }
  return context as CodeExplorerContextType<A, P>;
}

export type CodeExplorerProviderProps<
  A extends AdapterId,
  P extends PluginId<A>,
> = {
  value: CodeExplorerContextType<A, P>;
  children: ReactNode;
};

export function CodeExplorerProvider<
  A extends AdapterId,
  P extends PluginId<A>,
>({ value, children }: CodeExplorerProviderProps<A, P>) {
  return (
    <CodeExplorerContext.Provider value={value}>
      {children}
    </CodeExplorerContext.Provider>
  );
}
