import { openLinkInNewTab } from "@/utils/window";
import {
  getExampleAppGitHubUrl,
  getExampleUrl,
  type AdapterId,
  type ExampleLocator,
  type PluginId,
} from "@jsoc/grid-docs";
import { createContext, useRef, type ReactNode, type RefObject } from "react";
import { useContext } from "react";

export type ExamplePreviewContextValue = {
  previewRef: RefObject<HTMLIFrameElement | null>;
  url: string;
  reloadPreview: () => void;
  openPreviewInNewTab: () => void;
  viewSourceOnGitHub: () => void;
};

export const ExamplePreviewContext =
  createContext<ExamplePreviewContextValue | null>(null);

export type ExamplePreviewProviderProps<
  A extends AdapterId,
  P extends PluginId<A>,
> = ExampleLocator<A, P> & {
  children?: ReactNode;
};

/** Provides {@link ExamplePreviewContext} to the children components. */
export function ExamplePreviewProvider<
  A extends AdapterId,
  P extends PluginId<A>,
>({
  adapterId,
  pluginId,
  exampleId,
  children,
}: ExamplePreviewProviderProps<A, P>) {
  const previewRef = useRef<HTMLIFrameElement>(null);
  const url = getExampleUrl(adapterId, pluginId, exampleId);
  const githubUrl = getExampleAppGitHubUrl(adapterId, pluginId);

  const ctx: ExamplePreviewContextValue = {
    url,
    previewRef,
    reloadPreview: () => previewRef.current?.contentWindow?.location.reload(),
    openPreviewInNewTab: () => openLinkInNewTab(url),
    viewSourceOnGitHub: () => openLinkInNewTab(githubUrl),
  };

  return (
    <ExamplePreviewContext.Provider value={ctx}>
      {children}
    </ExamplePreviewContext.Provider>
  );
}

/** Hook for reading value of {@link ExamplePreviewContext} */
export function useExamplePreviewContext() {
  const context = useContext(ExamplePreviewContext);
  if (!context) {
    throw new Error(
      "useExamplePreviewContext must be used within an ExamplePreviewProvider",
    );
  }
  return context;
}
