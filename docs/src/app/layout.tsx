import "@/app/globals.css";
import "nextra-theme-docs/style.css";

import type { Metadata } from "next";
import { Footer } from "@/components/root/Footer";
import { Navbar } from "@/components/root/Navbar";
import { QueryProvider } from "@/components/root/QueryProvider";
import { ThemeProvider } from "@/components/root/ThemeProvider";
import { Head } from "nextra/components";
import { Layout } from "nextra-theme-docs";
import { getPageMap } from "nextra/page-map";

export const metadata: Metadata = {
  title: "JSOC Grid",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head />
      <body>
        <ThemeProvider>
          <QueryProvider>
            <Layout
              darkMode={false} // hide theme toggle button as Navbar already has it
              sidebar={{ defaultMenuCollapseLevel: 1 }}
              navbar={<Navbar />}
              pageMap={await getPageMap()}
              docsRepositoryBase="https://github.com/jsoc-dev/grid/tree/main/docs"
              footer={<Footer />}
            >
              {children}
            </Layout>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
