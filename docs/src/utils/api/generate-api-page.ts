import type { GenerateDefinitionResult } from "@/utils/api/api-reference-types";
import { getApiExports } from "@/utils/api/get-api-exports";
import {
  Node,
  type InterfaceDeclaration,
  type TypeAliasDeclaration,
} from "ts-morph";
import { getMDXComponents } from "@/mdx-components";
import { notFound } from "next/navigation";
import { generateDefinition, type Tags } from "nextra/tsdoc";
import { compileMdx } from "nextra/compile";
import { evaluate } from "nextra/evaluate";
import path from "node:path";
import { createRawMdxForApi } from "@/utils/api/create-raw-mdx-for-api";

const mdxComponents = getMDXComponents();

export async function generateApiPage(props: PageProps<"/api/[name]">) {
  // TODO: currently the first segment is apiName, refactor to api/packageName/apiName
  const { name: apiName } = await props.params;
  const apiExport = getApiExports().find((e) => e.name === apiName);

  if (!apiExport) return notFound();

  const { declaration } = apiExport;
  const declarationSourceFilePath = declaration.getSourceFile().getFilePath();

  // We want the relative path from the monorepo root to properly instruct ts-morph downstream.
  // However, Nextra's TS morph instance in generate-api-reference uses CWD=docs.
  // So the path should be relative to `docs`.
  const exportedModuleSpecifier = path
    .relative(process.cwd(), declarationSourceFilePath) // returns path relative to `docs`, example: "..\packages\grid-core\src\index.ts"
    .replace(/\\/g, "/"); // module specifiers must use forward slash

  const shouldGenerateDefinition =
    Node.isTypeAliasDeclaration(declaration) ||
    Node.isInterfaceDeclaration(declaration)
      ? typeHasCustomProperties(declaration)
      : true;

  let definition: GenerateDefinitionResult | undefined = undefined;
  if (shouldGenerateDefinition) {
    try {
      const generatedDefinition = generateDefinition({
        code: `export { ${apiExport.name} as default } from '${exportedModuleSpecifier}';`,
      });
      definition = formatLinksInDefinitionParts(generatedDefinition);
    } catch (err) {
      if (err instanceof Error && err.message.includes("No properties found")) {
        // nextra throws an Error with message 'No properties found...' when no props are found on a declaration type
        // See https://github.com/shuding/nextra/blob/main/packages/nextra/src/server/tsdoc/base.ts#L126
        // we are ignoring this error for now
      } else {
        throw err;
      }
    }
  }

  const rawMdx = createRawMdxForApi(apiExport, definition);
  const rawJs = await compileMdx(rawMdx);
  const page = evaluate(rawJs, mdxComponents, { definition });

  const githubFilePath = exportedModuleSpecifier.replace(/^\.\.\//, ""); // removes leading "..", example: "../packages/xyz" => "packages/xyz" (relative path to repo's root instead of `docs`)
  page.metadata.filePath = `https://github.com/jsoc-dev/grid/tree/main/${githubFilePath}`;

  return page;
}

function typeHasCustomProperties(
  decl: TypeAliasDeclaration | InterfaceDeclaration,
) {
  const type = decl.getType();
  const props = type.getProperties();

  // We only want to parse and render an API property table if the type actually
  // possesses at least one custom, developer-defined property.
  return props.some((prop) => {
    const decls = prop.getDeclarations();

    // If it has no explicit declarations (e.g. a synthetic property from a mapped type), it's custom.
    if (decls.length === 0) return true;

    // Otherwise, it's custom if at least one declaration is NOT from TypeScript's core libraries.
    return decls.some(
      (d) =>
        !d
          .getSourceFile()
          .getFilePath()
          .includes("node_modules/typescript/lib"),
    );
  });
}

function formatLinksInDefinitionParts(
  definition: GenerateDefinitionResult,
): GenerateDefinitionResult {
  // Nextra evaluates ASTs in isolation without resolving imports. Because of a
  // quirk in the TypeScript compiler (which Nextra uses under the hood), unresolved
  // JSDoc links are accidentally assigned a trailing space (e.g. `{@link GridRows }`).
  // We use .trim() to clean up the trailing space before turning them into code blocks.
  const trimLinkTrailingSpaces = (text: string): string =>
    text.replace(/\{@link ([^}]+)\}/g, (_, p1: string) => `\`${p1.trim()}\``);

  let tags: Tags | undefined;

  if (definition.tags) {
    tags = {};
    for (const key in definition.tags) {
      tags[key] = trimLinkTrailingSpaces(definition.tags[key]);
    }
  }

  const description = definition.description
    ? trimLinkTrailingSpaces(definition.description)
    : undefined;

  return { ...definition, description, tags };
}
