import { getMDXComponents } from "@/mdx-components";
import { getApiExports } from "@/utils/api/api-exports";
import { generateApiPage } from "@/utils/api/generate-api-page";
import { generateApiDefinition } from "@/utils/api/generate-api-definition";
import { API_PACKAGES, isValidApiPackageName } from "@/utils/api/api-packages";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/dynamicParams
export const dynamicParams = false;

// https://nextjs.org/docs/app/api-reference/functions/generate-static-params
export const generateStaticParams = () => {
  return API_PACKAGES.flatMap((packageName) =>
    getApiExports(packageName).map(({ name: apiName }) => ({
      packageName,
      apiName,
    })),
  );
};

// https://nextjs.org/docs/app/api-reference/functions/generate-metadata
export const generateMetadata = async (
  props: PageProps<"/api/[packageName]/[apiName]">,
): Promise<Metadata> => {
  const { packageName, apiName } = await props.params;
  if (!isValidApiPackageName(packageName)) return notFound();
  return { title: `${apiName} - API Reference` };
};

const Wrapper = getMDXComponents().wrapper;

export default async function Page(
  props: PageProps<"/api/[packageName]/[apiName]">,
) {
  const { packageName, apiName } = await props.params;
  if (!isValidApiPackageName(packageName)) return notFound();

  const apiExport = getApiExports(packageName).find((e) => e.name === apiName);
  if (!apiExport) return notFound();

  const definition = await generateApiDefinition(apiExport);
  const page = await generateApiPage(apiExport, definition);
  const { default: MDXContent, toc, metadata, sourceCode } = page;

  return (
    <Wrapper toc={toc} metadata={metadata} sourceCode={sourceCode}>
      <MDXContent />
    </Wrapper>
  );
}
