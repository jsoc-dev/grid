import { useMDXComponents as getMDXComponents } from "@/mdx-components";
import type { DocsParams } from "@/constants/docs";
import { Tabs, Steps, Cards, Callout, FileTree } from "nextra/components";
import { compileMdx } from "nextra/compile";
import { evaluate } from "nextra/evaluate";
import { getAdapterMetadata, getPluginMetadata } from "@jsoc/grid-docs";
import type { EvaluateResult } from "nextra";
import { resolveDocsParams } from "@/utils/resolveDocsParams";
import { isString, isPlainObject } from "@jsoc/utils";

export async function evaluateDynamicContentPage(
  pageProps: PageProps<"/docs/[[...mdxPath]]">,
  page: EvaluateResult,
) {
  const { mdxPath = [] } = await pageProps.params;
  const searchParams = await pageProps.searchParams;

  const docsParams = resolveDocsParams(searchParams);
  const scope = createDynamicContentScope(docsParams);
  const cacheKey = `${mdxPath.join("/")}:${docsParams.adapterId}:${docsParams.pluginId}`;

  const compiledSource = await upsertCompiledSource(page, scope, cacheKey);

  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- ignore unused wrapper
    wrapper,
    ...themeComponents
  } = getMDXComponents();

  const components = {
    ...themeComponents,
    $Tabs: Tabs,
    $Steps: Steps,
    $Cards: Cards,
    $Callout: Callout,
    $FileTree: FileTree,
  };

  const evaluateResult = evaluate(compiledSource, components, scope);

  return evaluateResult;
}

function createDynamicContentScope(docsParams: DocsParams) {
  const adapter = getAdapterMetadata(docsParams.adapterId);
  const plugin = getPluginMetadata(docsParams.adapterId, docsParams.pluginId);

  return { adapter, plugin };
}

const COMPILED_SOURCE_CACHE = new Map<string, string>();

async function upsertCompiledSource(
  page: EvaluateResult,
  scope: Record<string, unknown>,
  cacheKey: string,
) {
  let compiledSource = COMPILED_SOURCE_CACHE.get(cacheKey);

  if (!compiledSource) {
    const sourceCode = replaceDynamicContentTokens(page.sourceCode, scope);
    const { filePath } = page.metadata;
    compiledSource = await compileMdx(sourceCode, {
      filePath,
      defaultShowCopyCode: true,
    });

    COMPILED_SOURCE_CACHE.set(cacheKey, compiledSource);
  }

  return compiledSource;
}

const DYNAMIC_CONTENT_TOKEN_REGEX = /%%([a-zA-Z0-9_.]+)%%/g;

function replaceDynamicContentTokens(
  source: string,
  scope: Record<string, unknown>,
): string {
  const updatedSource = source.replace(
    DYNAMIC_CONTENT_TOKEN_REGEX,
    (_matchedSubString, tokenPath: string) => {
      const tokenParts = tokenPath.split(".");
      const finalValue = tokenParts.reduce<unknown>((currentValue, key) => {
        if (!isPlainObject(currentValue) || !(key in currentValue)) {
          throw new Error(`Invalid token path: ${tokenPath}`);
        }
        return currentValue[key];
      }, scope);

      if (!isString(finalValue)) {
        throw new Error(
          `Resolved value for token '${tokenPath}' is not a string. It must be a string to be used in the MDX source.`,
        );
      }

      return finalValue;
    },
  );

  return updatedSource;
}
