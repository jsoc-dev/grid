import { Cards } from "nextra/components";
import { getMDXComponents } from "@/mdx-components";
import { createPageMetadata } from "@/utils/og-metadata";
import type { Metadata } from "next";
import { API_PACKAGES, withPackageScope } from "@/utils/api/api-packages";

export async function generateMetadata(): Promise<Metadata> {
  return createPageMetadata({
    title: "API Reference",
    description: "Browse API references for all JSOC Grid packages.",
  });
}

const mdxComponents = getMDXComponents();
const Wrapper = mdxComponents.wrapper;
const H1 = mdxComponents.h1;
const H2 = mdxComponents.h2;

export default function ApiIndexPage() {
  const pageMeta = { title: "API", filePath: "" };

  return (
    <Wrapper metadata={pageMeta} toc={[]} sourceCode="">
      <H1>API Reference</H1>
      <p className="mt-6 leading-7 first:mt-0">
        Welcome to the JSOC Grid API Reference. Here you will find detailed
        documentation for all the classes, functions, and types exported across
        the JSOC Grid packages. Select a package below to explore its API
        exports.
      </p>

      <H2>Packages</H2>

      <Cards>
        {API_PACKAGES.map((pkg) => (
          <Cards.Card
            key={pkg}
            title={withPackageScope(pkg)}
            href={`/api/${pkg}`}
          />
        ))}
      </Cards>
    </Wrapper>
  );
}
