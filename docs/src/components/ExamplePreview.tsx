"use client";

import {
  ExamplePreviewProvider,
  useExamplePreview,
} from "@/contexts/ExamplePreviewContext";
import { useValidateExampleUrl } from "@/hooks/useValidateExampleUrl";

/**
 * Example preview component. Must be wrapped in an {@link ExamplePreviewProvider} or {@link ExamplePreview.Provider}.
 */
export function ExamplePreview() {
  const { url, previewRef } = useExamplePreview();
  const { isPending, isError } = useValidateExampleUrl(url);

  const msg = isPending ? "Loading..." : isError ? "Example not found" : null;

  if (msg) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <span className="text-muted-foreground">{msg}</span>
      </div>
    );
  }

  return <iframe ref={previewRef} className="h-full w-full" src={url} />;
}

ExamplePreview.Provider = ExamplePreviewProvider;
