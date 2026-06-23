import { useMDXComponents as getMDXComponents } from "next-mdx-import-source-file";
import type { Metadata } from "next";
import { generateStaticParamsFor, importPage } from "nextra/pages";

export const generateStaticParams = generateStaticParamsFor("mdxPath");

export async function generateMetadata(
  props: PageProps<"/docs/[[...mdxPath]]">,
): Promise<Metadata> {
  const params = await props.params;
  const { mdxPath = [] } = params;

  if (mdxPath.length === 0) {
    return { title: "Documentation" };
  }

  const { metadata } = await importPage(mdxPath);

  return metadata;
}

const Wrapper = getMDXComponents().wrapper;

export default async function Page(props: PageProps<"/docs/[[...mdxPath]]">) {
  const params = await props.params;
  const { mdxPath = [] } = params;

  const {
    default: MDXContent,
    toc,
    metadata,
    sourceCode,
  } = await importPage(mdxPath);

  return (
    <Wrapper toc={toc} metadata={metadata} sourceCode={sourceCode}>
      <MDXContent {...props} params={params} />
    </Wrapper>
  );
}
