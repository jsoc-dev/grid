import { getMDXComponents } from "@/mdx-components";
import type { ApiPageProps, ApiStaticParamsList } from "@/types/api-routes";
import { getApiExports } from "@/utils/api/api-exports";
import { generateApiPage } from "@/utils/api/generate-api-page";
import { generateApiDefinition } from "@/utils/api/generate-api-definition";
import { API_PACKAGES } from "@/utils/api/api-packages";
import { createPageMetadata } from "@/utils/og-metadata";
import type { Metadata } from "next";

// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/dynamicParams
export const dynamicParams = false;

// https://nextjs.org/docs/app/api-reference/functions/generate-static-params
export function generateStaticParams(): ApiStaticParamsList<"/api/[packageName]/[apiName]"> {
  return API_PACKAGES.flatMap((packageName) =>
    getApiExports(packageName).map(({ name: apiName }) => ({
      packageName,
      apiName,
    })),
  );
}

// https://nextjs.org/docs/app/api-reference/functions/generate-metadata
export async function generateMetadata(
  props: ApiPageProps<"/api/[packageName]/[apiName]">,
): Promise<Metadata> {
  const { packageName, apiName } = await props.params;

  const title = `${apiName} - API Reference`;
  const description = `View the complete reference for the "${apiName}" API of the "${packageName}" package.`;

  return createPageMetadata({ title, description });
}

const Wrapper = getMDXComponents().wrapper;

export default async function Page(
  props: ApiPageProps<"/api/[packageName]/[apiName]">,
) {
  const { packageName, apiName } = await props.params;

  const apiExport = getApiExports(packageName).find((e) => e.name === apiName)!;

  const definition = await generateApiDefinition(apiExport);
  const page = await generateApiPage(apiExport, definition);
  const { default: MDXContent, toc, metadata, sourceCode } = page;

  return (
    <Wrapper toc={toc} metadata={metadata} sourceCode={sourceCode}>
      <MDXContent />
    </Wrapper>
  );
}
