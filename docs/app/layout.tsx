import "@/globals.css";
import "nextra-theme-docs/style.css";

import { JsocLogo } from "@/_components";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Head } from "nextra/components";
import { getPageMap } from "nextra/page-map";
import { Footer, Layout, Navbar, ThemeSwitch } from "nextra-theme-docs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JSOC",
  description:
    "JSOC is a framework-agnostic system that converts any JSON data into fully functional UI components.",
};

const navbar = (
  <Navbar
    align="left"
    className="[&>a:first-child]:mr-6" // add margin right in home link
    logo={<JsocLogo />}
    projectLink="https://github.com/jsoc-dev/jsoc"
  >
    <ThemeSwitch
      lite
      className="h-6! w-6! px-0! bg-transparent! rounded-[50%]! [&_svg]:h-6 [&_svg]:w-6"
    />
  </Navbar>
);

const footer = <Footer>{`MIT ${new Date().getFullYear()} © JSOC`}</Footer>;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      dir="ltr"
      // Suggested by `next-themes` package https://github.com/pacocoursey/next-themes#with-app
      suppressHydrationWarning
    >
      <Head />

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Layout
          navbar={navbar}
          pageMap={await getPageMap()}
          docsRepositoryBase="https://github.com/jsoc-dev/jsoc/tree/main/docsite"
          footer={footer}
        >
          {children}
        </Layout>
      </body>
    </html>
  );
}
