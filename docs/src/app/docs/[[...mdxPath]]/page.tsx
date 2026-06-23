import { useMDXComponents as getMDXComponents } from "@/mdx-components";
import { DynamicContentScopeBoundary } from "@/utils/dynamicContentScope";
import type { Metadata } from "next";
import { generateStaticParamsFor, importPage } from "nextra/pages";
import { resolveDocsParams } from "@/utils/resolveDocsParams";
import type { DocsParams } from "@/constants/docs";
import { getAdapterMetadata, getPluginMetadata } from "@jsoc/grid-docs";
import { hasDynamicContent } from "@/utils/dynamicContent";

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
  const searchParams = await props.searchParams;
  const page = await importPage(params.mdxPath);
  const { default: MDXContent, toc, metadata, sourceCode } = page;

  const content = (
    <Wrapper toc={toc} metadata={metadata} sourceCode={sourceCode}>
      <MDXContent />
    </Wrapper>
  );

  if (hasDynamicContent(sourceCode)) {
    // Only dynamic pages need the replacement scope. Static pages stay unwrapped
    // so their MDX renders exactly as compiled by Nextra.
    const scope = createDynamicContentScope(resolveDocsParams(searchParams));

    return (
      <DynamicContentScopeBoundary scope={scope}>
        {content}
      </DynamicContentScopeBoundary>
    );
  }

  return content;
}

function createDynamicContentScope(docsParams: DocsParams) {
  // Keep token values grouped by top-level token namespace:
  // %%adapter.packageName%%, %%plugin.name%%, and similar paths.
  const adapter = getAdapterMetadata(docsParams.adapterId);
  const plugin = getPluginMetadata(docsParams.adapterId, docsParams.pluginId);

  return { adapter, plugin };
}
