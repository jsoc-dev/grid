import { SyncCookieDocsParams } from "@/components/SyncCookieDocsParams";
import { Suspense } from "react";

export default function DocsLayout({ children }: LayoutProps<"/docs">) {
  return (
    <>
      <Suspense fallback={null}>
        <SyncCookieDocsParams />
      </Suspense>
      {children}
    </>
  );
}
