import { getMDXComponents } from "@/mdx-components";
import type { SerializedApiExport } from "@/artifacts/artifacts-types";
import { getSerializedApiExports } from "@/artifacts/get-serialized-api-exports";
import { DeclarationKind } from "@/utils/api/api-declaration";
import { getExportSectionTitle } from "@/utils/api/api-package-index-page";
import {
  API_PACKAGES,
  isValidApiPackageName,
  withPackageScope,
} from "@/utils/api/api-packages";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Heading } from "nextra";
import { Cards } from "nextra/components";

export const dynamicParams = false;

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

  const apiExportsByKind = getSerializedApiExports(packageName);
  const exportsByKindEntries = Object.values(DeclarationKind)
    .filter((kind) => (apiExportsByKind[kind]?.length ?? 0) > 0)
    .map((kind) => {
      const title = getExportSectionTitle(kind);
      return {
        id: title.toLowerCase().replace(/ /g, "-"),
        title,
        apiExports: apiExportsByKind[kind]!,
      };
    });

  const toc: Heading[] = [];
  for (const { id, title } of exportsByKindEntries) {
    toc.push({ id, depth: 2, value: title });
  }

  const packageNameWithScope = withPackageScope(packageName);
  const metadata = { title: packageNameWithScope, filePath: "" };

  return (
    <Wrapper metadata={metadata} toc={toc} sourceCode="">
      <H1>
        <Code>{packageNameWithScope}</Code> package
      </H1>

      {exportsByKindEntries.map((entry) => (
        <ExportSection key={entry.id} {...entry} />
      ))}
    </Wrapper>
  );
}

function ExportSection({
  id,
  title,
  apiExports,
}: {
  id: string;
  title: string;
  apiExports: SerializedApiExport[];
}) {
  if (apiExports.length === 0) return null;

  return (
    <>
      <H2 id={id}>{title}</H2>
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
