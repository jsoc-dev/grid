import { Footer } from "@/components/root/Footer";
import { QueryProvider } from "@/components/root/QueryProvider";
import { RootContextProvider } from "@/components/root/RootContextProvider";
import { Navbar } from "@/components/root/navbar/Navbar";
import { Layout } from "nextra-theme-docs";
import { getPageMap } from "nextra/page-map";
import type { ReactNode } from "react";

export async function Root({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <RootContextProvider>
        <Layout
          navbar={<Navbar />}
          pageMap={await getPageMap()}
          docsRepositoryBase="https://github.com/jsoc-dev/grid/tree/main/docs"
          footer={<Footer />}
        >
          {children}
        </Layout>
      </RootContextProvider>
    </QueryProvider>
  );
}
