import { getMDXComponents } from "@/mdx-components";
import { getApiExports } from "@/utils/api/api-exports";
import type { ApiExport } from "@/utils/api/api-reference-types";
import {
  API_PACKAGES,
  isValidApiPackageName,
  withPackageScope,
} from "@/utils/api/api-package-name";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Heading } from "nextra";
import { Cards } from "nextra/components";
import { Node } from "ts-morph";

export const generateStaticParams = () => {
  return API_PACKAGES.map((packageName) => ({ packageName }));
};

export const generateMetadata = async (
  props: PageProps<"/api/[packageName]">,
): Promise<Metadata> => {
  const { packageName } = await props.params;
  return { title: packageName };
};

const mdxComponents = getMDXComponents();
const Wrapper = mdxComponents.wrapper;
const H1 = mdxComponents.h1;
const H2 = mdxComponents.h2;
const Code = mdxComponents.code;

export default async function PackageApiIndexPage(
  props: PageProps<"/api/[packageName]">,
) {
  const { packageName } = await props.params;
  if (!isValidApiPackageName(packageName)) return notFound();

  const apiExports = getApiExports(packageName);
  const classExports = apiExports.filter((e) =>
    Node.isClassDeclaration(e.declaration),
  );
  const functionExports = apiExports.filter((e) =>
    Node.isFunctionDeclaration(e.declaration),
  );
  const typeExports = apiExports.filter(
    (e) =>
      Node.isTypeAliasDeclaration(e.declaration) ||
      Node.isInterfaceDeclaration(e.declaration),
  );

  const toc: Heading[] = [];

  if (classExports.length > 0)
    toc.push({ depth: 2, value: "Classes", id: "classes" });

  if (functionExports.length > 0)
    toc.push({ depth: 2, value: "Functions", id: "functions" });

  if (typeExports.length > 0)
    toc.push({ depth: 2, value: "Types", id: "types" });

  const packageNameWithScope = withPackageScope(packageName);
  const metadata = { title: packageNameWithScope, filePath: "" };

  return (
    <Wrapper metadata={metadata} toc={toc} sourceCode="">
      <H1>
        <Code>{packageNameWithScope}</Code> package
      </H1>

      <ExportSection title="Classes" apiExports={classExports} />
      <ExportSection title="Functions" apiExports={functionExports} />
      <ExportSection title="Types" apiExports={typeExports} />
    </Wrapper>
  );
}

function ExportSection({
  title,
  apiExports,
}: {
  title: string;
  apiExports: ApiExport[];
}) {
  if (apiExports.length === 0) return null;

  return (
    <>
      <H2 id={title.toLowerCase()}>{title}</H2>
      <Cards>
        {apiExports.map((exp) => (
          <Cards.Card
            key={exp.name}
            title={exp.name}
            href={`/api/${exp.packageName}/${exp.name}`}
          />
        ))}
      </Cards>
    </>
  );
}
