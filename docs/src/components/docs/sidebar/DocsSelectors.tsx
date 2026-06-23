import { SelectAdapter } from "@/components/docs/sidebar/SelectAdapter";
import { SelectPlugin } from "@/components/docs/sidebar/SelectPlugin";
import { Suspense } from "react";

export function DocsSelectors() {
  return (
    <div className="-mx-2 flex flex-col gap-1.5">
      {/* Rendered from _meta.global.tsx, outside docs/layout children — needs its
          own boundary because SelectAdapter/SelectPlugin call useSearchParams. */}
      <Suspense fallback={null}>
        <SelectAdapter />
        <SelectPlugin />
      </Suspense>
    </div>
  );
}
