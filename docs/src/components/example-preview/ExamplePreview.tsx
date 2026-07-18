"use client";

import { useExamplePreviewContext } from "@/components/example-preview/ExamplePreviewContext";
import { useValidateExampleUrl } from "@/components/example-preview/useValidateExampleUrl";
import type { ReactNode } from "react";

/** Example preview component. Must be wrapped in an `ExamplePreviewProvider` */
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

// In Next.js, when a Server Component (like Example.tsx) imports a Client Component (like ExamplePreview.tsx),
// the imported component is actually a Client Component Reference (a proxy reference).
// Any static properties attached to the component function (such as ExamplePreview.Provider = ExamplePreviewProvider)
// do not cross the boundary and evaluate to undefined on the server.
// So, rendering <ExamplePreview.Provider> will throw error: "got: undefined".
// ExamplePreview.Provider = ExamplePreviewProvider;
