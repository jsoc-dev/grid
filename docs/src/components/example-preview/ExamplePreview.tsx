"use client";

import {
  ExamplePreviewProvider,
  useExamplePreviewContext,
} from "@/components/example-preview/ExamplePreviewContext";
import { useValidateExampleUrl } from "@/components/example-preview/useValidateExampleUrl";
import type { ReactNode } from "react";

/**
 * Example preview component. Must be wrapped in an {@link ExamplePreviewProvider} or {@link ExamplePreview.Provider}.
 */
export function ExamplePreview() {
  const { url, previewRef } = useExamplePreviewContext();
  const { isPending, isError } = useValidateExampleUrl(url);

  if (isPending) return <Viewport />; // render nothing - similar to browsers when page is being fetched
  if (isError) return <Viewport>Something went wrong</Viewport>;

  return (
    <Viewport>
      <iframe ref={previewRef} className="h-full w-full" src={url} />
    </Viewport>
  );
}

function Viewport({ children }: { children?: ReactNode }) {
  return <div className="bg-mono h-full w-full">{children}</div>;
}

ExamplePreview.Provider = ExamplePreviewProvider;
