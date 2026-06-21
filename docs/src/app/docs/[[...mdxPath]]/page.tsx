import { useMDXComponents as getMDXComponents } from "@/mdx-components";
import { evaluateDynamicContentPage } from "@/utils/evaluateDynamicContentPage";
import type { Metadata } from "next";
import { generateStaticParamsFor, importPage } from "nextra/pages";

export const generateStaticParams = generateStaticParamsFor("mdxPath");

export async function generateMetadata(
  props: PageProps<"/docs/[[...mdxPath]]">,
): Promise<Metadata> {
  const params = await props.params;
  const { metadata } = await importPage(params.mdxPath);
  return metadata;
}

const Wrapper = getMDXComponents().wrapper;

export default async function Page(props: PageProps<"/docs/[[...mdxPath]]">) {
  const params = await props.params;
  const precompiledPage = await importPage(params.mdxPath);
  const page = precompiledPage.metadata.dynamicContent
    ? await evaluateDynamicContentPage(props, precompiledPage)
    : precompiledPage;
  const { default: MDXContent, toc, metadata, sourceCode } = page;

  return (
    <Wrapper toc={toc} metadata={metadata} sourceCode={sourceCode}>
      <MDXContent />
    </Wrapper>
  );
}
