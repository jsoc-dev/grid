import { getMDXComponents } from "@/mdx-components";
import type { SerializedApiExport } from "@/artifacts/artifacts-types";
import { getSerializedApiExports } from "@/artifacts/get-serialized-api-exports";
import type { ApiPageProps, ApiStaticParamsList } from "@/types/api-routes";
import { DeclarationKind } from "@/utils/api/api-declaration";
import { getExportSectionTitle } from "@/utils/api/api-package-index-page";
import { API_PACKAGES, withPackageScope } from "@/utils/api/api-packages";
import { createPageMetadata } from "@/utils/og-metadata";
import type { Metadata } from "next";
import type { Heading } from "nextra";
import { Cards } from "nextra/components";

export const dynamicParams = false;

export function generateStaticParams(): ApiStaticParamsList<"/api/[packageName]"> {
  return API_PACKAGES.map((packageName) => ({ packageName }));
}

export async function generateMetadata(
  props: ApiPageProps<"/api/[packageName]">,
): Promise<Metadata> {
  const { packageName } = await props.params;
  const packageNameWithScope = withPackageScope(packageName);
  const title = `${packageNameWithScope} APIs`;
  const description = `Browse APIs exported from ${packageNameWithScope}.`;
  return createPageMetadata({ title, description });
}

const mdxComponents = getMDXComponents();
const Wrapper = mdxComponents.wrapper;
const H1 = mdxComponents.h1;
const H2 = mdxComponents.h2;
const Code = mdxComponents.code;

/** Index page for a package's API reference. */
export default async function PackageApiIndexPage(
  props: ApiPageProps<"/api/[packageName]">,
) {
  const { packageName } = await props.params;

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
