import "@/app/globals.css";
import "nextra-theme-docs/style.css";
import { Root } from "@/components/root/Root";

import type { Metadata } from "next";
import { Head } from "nextra/components";

export const metadata: Metadata = {
  title: "JSOC Grid",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head />
      <body>
        <Root>{children}</Root>
      </body>
    </html>
  );
}
