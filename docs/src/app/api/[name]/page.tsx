import { getMDXComponents } from "@/mdx-components";
import { generateApiPage } from "@/utils/api/generate-api-page";
import { getApiExports } from "@/utils/api/get-api-exports";
import type { Metadata } from "next";

// https://nextjs.org/docs/app/api-reference/functions/generate-static-params
export const generateStaticParams = () =>
  getApiExports().map(({ name }) => ({ name }));

// https://nextjs.org/docs/app/api-reference/functions/generate-metadata
export const generateMetadata = async (
  props: PageProps<"/api/[name]">,
): Promise<Metadata> => (await generateApiPage(props)).metadata;

const Wrapper = getMDXComponents().wrapper;

export default async function Page(props: PageProps<"/api/[name]">) {
  const page = await generateApiPage(props);
  const { default: MDXContent, toc, metadata, sourceCode } = page;

  return (
    <Wrapper toc={toc} metadata={metadata} sourceCode={sourceCode}>
      <MDXContent />
    </Wrapper>
  );
}
