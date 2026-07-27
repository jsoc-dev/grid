import { getMDXComponents } from "@/mdx-components";
import { isResolvedApiExport } from "@/utils/api/api-exports";
import type {
  ApiExport,
  GenerateDefinitionResult,
} from "@/utils/api/api-reference-types";
import { createRawMdxForApi } from "@/utils/api/create-raw-mdx-for-api";
import { compileMdx } from "nextra/compile";
import { evaluate } from "nextra/evaluate";
import type { EvaluateResult } from "nextra";
import { renderUnresolvedApiPage } from "@/components/api/api-page";

const mdxComponents = getMDXComponents();
const cache = new Map<string, EvaluateResult>();

// FIXME: Sidebar overscrolls on clicking Core menu
export async function generateApiPage(
  apiExport: ApiExport,
  definition: GenerateDefinitionResult | undefined,
): Promise<EvaluateResult> {
  const cacheKey = `${apiExport.packageName}/${apiExport.name}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey)!;

  if (!isResolvedApiExport(apiExport)) {
    const page: EvaluateResult = {
      default: () => renderUnresolvedApiPage(apiExport),
      toc: [],
      metadata: { title: apiExport.name, filePath: "" },
      sourceCode: "",
    };
    return updateCache(cacheKey, page);
  }

  const rawMdx = createRawMdxForApi(apiExport, definition);
  const rawJs = await compileMdx(rawMdx);
  const page = evaluate(rawJs, mdxComponents, { definition });
  page.metadata.filePath = ""; // keeping this empty string since this is auto-generated, no file exists for it.

  return updateCache(cacheKey, page);
}

function updateCache(key: string, page: EvaluateResult) {
  cache.set(key, page);
  return page;
}
