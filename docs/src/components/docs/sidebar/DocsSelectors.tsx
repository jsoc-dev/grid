"use client";

import { SelectAdapter } from "@/components/docs/sidebar/SelectAdapter";
import { SelectPlugin } from "@/components/docs/sidebar/SelectPlugin";
import { usePathname } from "next/navigation";
import { CONTENT_DIR_BASE_PATH } from "@/config";
import { Info } from "lucide-react";
import { Suspense } from "react";

export function DocsSelectors() {
  const pathname = usePathname();

  // Disabled state indicating whether the user is on a documentation page.
  // This is needed as in small screen devices the sidebar is merged into the
  // navigation menu drawer causing the "DocsSelectors" to appear on every page.
  // But "DocsSelectors" should not be enabled on non-documentation pages because
  // they add search params to the url which have no use outside documentation pages.
  const disabled = !pathname.startsWith(CONTENT_DIR_BASE_PATH);

  return (
    <div className="-mx-2 flex flex-col gap-1.5">
      {/* Rendered from _meta.global.tsx, outside docs/layout.tsx children — needs its
          own boundary because SelectAdapter/SelectPlugin call useSearchParams. 
          https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout */}
      <Suspense fallback={null}>
        <SelectAdapter disabled={disabled} />
        <SelectPlugin disabled={disabled} />
        {disabled && (
          <div className="flex items-center gap-1.5 pl-2 text-xs text-blue-500">
            <Info className="mt-0.25 size-3.5 shrink-0" />
            <span>
              These options can only be changed on documentation pages.
            </span>
          </div>
        )}
      </Suspense>
    </div>
  );
}
