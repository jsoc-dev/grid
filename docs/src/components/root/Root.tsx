// import { Footer } from "@/components/root/Footer";
import { QueryProvider } from "@/components/root/QueryProvider";
import { ThemeProvider } from "@/components/root/ThemeProvider";

import { Navbar } from "@/components/root/Navbar";
import { Layout } from "nextra-theme-docs";
import { getPageMap } from "nextra/page-map";
import type { ReactNode } from "react";

export async function Root({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <Layout
          darkMode={false} // hide theme toggle button as Navbar already has it
          sidebar={{ defaultMenuCollapseLevel: 1 }}
          navbar={<Navbar />}
          pageMap={await getPageMap()}
          docsRepositoryBase="https://github.com/jsoc-dev/grid/tree/main/docs"
          // footer={<Footer />} // sidebar is disturbed when page is scrolled down to footer
        >
          {children}
        </Layout>
      </QueryProvider>
    </ThemeProvider>
  );
}
