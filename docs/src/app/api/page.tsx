import { Cards } from "nextra/components";
import { getMDXComponents } from "@/mdx-components";
import { getApiExports } from "@/utils/api/get-api-exports";
import type { Metadata } from "next";
import { Node } from "ts-morph";
import type { ApiExport } from "@/utils/api/api-reference-types";

export const metadata: Metadata = { title: "API" };

const mdxComponents = getMDXComponents();
const Wrapper = mdxComponents.wrapper;
const H1 = mdxComponents.h1;
const H2 = mdxComponents.h2;

export default function ApiIndexPage() {
  const apiExports = getApiExports();
  const pageMeta = { title: "API", filePath: "" };

  const filteredExportsList = (filterFn: (exp: ApiExport) => boolean) => (
    <Cards>
      {apiExports.filter(filterFn).map((exp) => (
        <Cards.Card key={exp.name} title={exp.name} href={`/api/${exp.name}`} />
      ))}
    </Cards>
  );

  return (
    <Wrapper metadata={pageMeta} toc={[]} sourceCode="">
      <H1>API</H1>

      <H2>Classes</H2>
      {filteredExportsList((e) => Node.isClassDeclaration(e.declaration))}

      <H2>Functions</H2>
      {filteredExportsList((e) => Node.isFunctionDeclaration(e.declaration))}

      <H2>Types</H2>
      {filteredExportsList(
        (e) =>
          Node.isTypeAliasDeclaration(e.declaration) ||
          Node.isInterfaceDeclaration(e.declaration),
      )}
    </Wrapper>
  );
}
