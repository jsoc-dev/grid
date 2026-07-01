"use client";

import { useExampleUrl } from "@/hooks/useExampleUrl";
import {
  type ExampleLocator,
  type AdapterId,
  type PluginId,
} from "@jsoc/grid-docs";
import { useRef, type ReactNode } from "react";
import clsx from "clsx";
import { type RefObject } from "react";

type ParamWhenPending = {
  isPending: true;
};

type ParamWhenError = {
  isPending: false;
  error: Error;
};

type ParamWhenLoaded = {
  isPending: false;
  error: null;
  openInNewTab: () => void;
  reload: () => void;
};

export type ExamplePreviewRendererParams = {
  preview: ReactNode;
} & (ParamWhenPending | ParamWhenError | ParamWhenLoaded);

export type ExamplePreviewRenderer = (
  params: ExamplePreviewRendererParams,
) => ReactNode;

export type ExamplePreviewProps<
  A extends AdapterId,
  P extends PluginId<A>,
> = ExampleLocator<A, P> & {
  className?: string;
  children?: ExamplePreviewRenderer;
};

export function ExamplePreview<A extends AdapterId, P extends PluginId<A>>({
  className,
  adapterId,
  pluginId,
  exampleId,
  children: renderer = ({ preview }) => preview,
}: ExamplePreviewProps<A, P>) {
  const previewRef = useRef<HTMLIFrameElement>(null);
  const { url, isPending, error } = useExampleUrl(
    adapterId,
    pluginId,
    exampleId,
  );

  if (isPending) {
    const preview = (
      <Fallback className={className}>Loading example...</Fallback>
    );
    return renderer({ preview, isPending });
  }

  if (error) {
    const preview = (
      <Fallback className={className}>Example not found</Fallback>
    );
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

type FallbackProps = {
  className?: string;
  children: ReactNode;
};

function Fallback({ className, children }: FallbackProps) {
  return (
    <div
      className={clsx(
        "h-full w-full flex items-center justify-center border",
        "border-zinc-300 dark:border-zinc-600/50",
        className,
      )}
    >
      {children}
    </div>
  );
}

type FrameProps = {
  className?: string;
  previewRef: RefObject<HTMLIFrameElement | null>;
  url: string;
};

function Frame({ className, previewRef, url }: FrameProps) {
  return (
    <iframe
      className={clsx("h-full w-full", className)}
      ref={previewRef}
      src={url}
      title="Example preview"
    />
  );
}
