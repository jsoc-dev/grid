"use client";

import { FallbackText } from "@/components/generic/example-preview/FallbackText";
import { Frame } from "@/components/generic/example-preview/Frame";
import { useExampleUrl } from "@/hooks/useExampleUrl";
import {
  type ExampleOptions,
  type FrameworkId,
  type PluginId,
} from "@jsoc/grid-docs";
import { useRef, type ReactNode } from "react";

export type ExamplePreviewProps<
  F extends FrameworkId,
  P extends PluginId<F>,
> = ExampleOptions<F, P> & {
  className?: string;
  children?: ExamplePreviewRenderer;
};

export type ExamplePreviewRenderer = (
  params: ExamplePreviewRendererParams,
) => ReactNode;

export type ExamplePreviewRendererParams = {
  preview: ReactNode;
} & (ParamWhenPending | ParamWhenError | Param);

export type ParamWhenPending = {
  isPending: true;
};

export type ParamWhenError = {
  isPending: false;
  error: Error;
};

export type Param = {
  isPending: false;
  error: null;
  openInNewTab: () => void;
  reload: () => void;
};

export function ExamplePreview<F extends FrameworkId, P extends PluginId<F>>({
  className,
  frameworkId,
  pluginId,
  exampleId,
  children: renderer = ({ preview }) => preview,
}: ExamplePreviewProps<F, P>) {
  const previewRef = useRef<HTMLIFrameElement>(null);
  const { url, isPending, error } = useExampleUrl(
    frameworkId,
    pluginId,
    exampleId,
  );

  if (isPending) {
    const preview = <FallbackText>Loading example...</FallbackText>;
    return renderer({ preview, isPending });
  }

  if (error) {
    const preview = <FallbackText>Example not found</FallbackText>;
    return renderer({ preview, isPending, error });
  }

  const preview = (
    <Frame className={className} previewRef={previewRef} url={url} />
  );
  const openInNewTab = () => {
    if (previewRef.current) {
      window.open(previewRef.current.src, "_blank");
    }
  };
  const reload = () => {
    if (previewRef.current?.contentWindow) {
      previewRef.current.contentWindow.location.reload();
    }
  };

  return renderer({ preview, isPending, error, openInNewTab, reload });
}
