"use client";

import { useExamplePreviewContext } from "@/components/example-preview/ExamplePreviewContext";
import { useValidateExampleUrl } from "@/components/example-preview/useValidateExampleUrl";
import { clsx } from "clsx";
import type { ReactNode } from "react";

export type ExamplePreviewProps = {
  iframeCls?: string;
  viewportCls?: string;
};

/** Example preview component. Must be wrapped in an `ExamplePreviewProvider` */
export function ExamplePreview({
  iframeCls,
  viewportCls,
}: ExamplePreviewProps) {
  const { url, previewRef } = useExamplePreviewContext();
  const { isPending, isError } = useValidateExampleUrl(url);

  const render = (children: ReactNode) => (
    <Viewport className={viewportCls}>{children}</Viewport>
  );

  if (isPending) return render(null); // render nothing - similar to browsers when page is being fetched
  if (isError) return render("Something went wrong");

  return render(
    <iframe
      ref={previewRef}
      className={clsx("h-full w-full", iframeCls)}
      src={url}
    />,
  );
}

function Viewport({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx("bg-mono h-full w-full", className)}>{children}</div>
  );
}

// In Next.js, when a Server Component (like Example.tsx) imports a Client Component (like ExamplePreview.tsx),
// the imported component is actually a Client Component Reference (a proxy reference).
// Any static properties attached to the component function (such as ExamplePreview.Provider = ExamplePreviewProvider)
// do not cross the boundary and evaluate to undefined on the server.
// So, rendering <ExamplePreview.Provider> will throw error: "got: undefined".
// ExamplePreview.Provider = ExamplePreviewProvider;
