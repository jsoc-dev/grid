import { Loading } from "@/components/Loading";
import type { ReactNode } from "react";
import { Suspense } from "react";

export default function DocsLayout({ children }: { children: ReactNode }) {
  // MDX pages render client components (If, Example) that read ?adapterId and
  // ?pluginId via useSearchParams. Those query params are not known during
  // generateStaticParams / next build, so Next requires a Suspense boundary to
  // prerender the static shell and hydrate search-param-dependent UI on the client.
  return <Suspense fallback={<Loading />}>{children}</Suspense>;
}
