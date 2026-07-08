import { createContext, useContext, type ReactNode } from "react";
import { type LanguagePreference } from "@jsoc/grid-docs";
import type { AdapterId, ExampleId, PluginId } from "@jsoc/grid-docs";
import type { SetState } from "@/types/react";
import type { ExampleSourceQueryResult } from "@/hooks/useExampleSource";

export type CodeExplorerContextType<
  A extends AdapterId,
  P extends PluginId<A>,
> = {
  adapterId: A;
  pluginId: P;
  exampleId: ExampleId<A, P>;
  source: ExampleSourceQueryResult;
  languagePreference: LanguagePreference;
  showSidebar: boolean;
  showOtherFiles: boolean;
  showSettings: boolean;
  setLanguagePreference: SetState<LanguagePreference>;
  setShowSidebar: SetState<boolean>;
  setShowOtherFiles: SetState<boolean>;
  setShowSettings: SetState<boolean>;
};

export type CodeExplorerProviderProps<
  A extends AdapterId,
  P extends PluginId<A>,
> = {
  value: CodeExplorerContextType<A, P>;
  children: ReactNode;
};

const CodeExplorerContext = createContext<unknown>(null);

export function CE_ContextProvider<A extends AdapterId, P extends PluginId<A>>({
  value,
  children,
}: CodeExplorerProviderProps<A, P>) {
  return (
    <CodeExplorerContext.Provider value={value}>
      {children}
    </CodeExplorerContext.Provider>
  );
}

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
