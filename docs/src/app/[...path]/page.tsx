import { useMDXComponents } from "@/mdx-components";
import type { Metadata } from "next";
import { generateStaticParamsFor, importPage } from "nextra/pages";

export const generateStaticParams = generateStaticParamsFor("mdxPath");

export async function generateMetadata(
  props: PageProps<"/[...path]">,
): Promise<Metadata> {
  const params = await props.params;
  const { metadata } = await importPage(params.path);

  return metadata;
}

// eslint-disable-next-line react-hooks/rules-of-hooks
const Wrapper = useMDXComponents().wrapper;

export default async function Page(props: PageProps<"/[...path]">) {
  const params = await props.params;
  const {
    default: MDXContent,
    toc,
    metadata,
    sourceCode,
  } = await importPage(params.path);

  return (
    <Wrapper toc={toc} metadata={metadata} sourceCode={sourceCode}>
      <MDXContent {...props} params={params} />
    </Wrapper>
  );
}
