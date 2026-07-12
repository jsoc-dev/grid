import { useMDXComponents as getMDXComponents } from "@/mdx-components";
import {
  createDynamicContentScope,
  DynamicContentScopeBoundary,
} from "@/utils/dynamicContentScope";
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
  const page = await importPage(params.mdxPath);
  const { default: MDXContent, toc, metadata, sourceCode } = page;

  const scope = await createDynamicContentScope(sourceCode, props);

  return (
    <Wrapper toc={toc} metadata={metadata} sourceCode={sourceCode}>
      <DynamicContentScopeBoundary scope={scope}>
        <MDXContent />
      </DynamicContentScopeBoundary>
    </Wrapper>
  );
}
