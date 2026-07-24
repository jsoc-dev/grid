import { cache } from "react";
import { getMDXComponents } from "@/mdx-components";
import type { ApiPackageName } from "@/utils/api/api-packages";
import type { GenerateDefinitionResult } from "@/utils/api/api-reference-types";
import { createRawMdxForApi } from "@/utils/api/create-raw-mdx-for-api";
import {
  getApiExports,
  getModuleSpecifierRelativeToDocs,
} from "@/utils/api/api-exports";
import { notFound } from "next/navigation";
import { compileMdx } from "nextra/compile";
import { evaluate } from "nextra/evaluate";
import { generateDefinition } from "nextra/tsdoc";
import {
  Node,
  type InterfaceDeclaration,
  type TypeAliasDeclaration,
} from "ts-morph";
import { isPlainObject, isString, type StringKeyedObject } from "@jsoc/utils";
import type { EvaluateResult } from "nextra";

const mdxComponents = getMDXComponents();

// FIXME: Props param for components is named as _0 (http://localhost:3000/api/react-grid/ChildGridToggle)
// FIXME: Sidebar overscrolls on clicking Core menu
export const generateApiPage = cache(async function generateApiPage(
  packageName: ApiPackageName,
  apiName: string,
): Promise<EvaluateResult> {
  const apiExport = getApiExports(packageName).find((e) => e.name === apiName);

  if (!apiExport) return notFound();

  const { declaration } = apiExport;

  const shouldGenerateDefinition =
    Node.isTypeAliasDeclaration(declaration) ||
    Node.isInterfaceDeclaration(declaration)
      ? typeHasCustomProperties(declaration)
      : true;

  let definition: GenerateDefinitionResult | undefined = undefined;
  if (declaration && shouldGenerateDefinition) {
    try {
      // We want the relative path from the monorepo root to properly instruct ts-morph downstream.
      // However, Nextra's TS morph instance in generate-api-reference uses CWD=docs.
      // So the path should be relative to `docs`.
      const moduleSpecifier = getModuleSpecifierRelativeToDocs(declaration);
      const generatedDefinition = generateDefinition({
        code: `export { ${apiExport.name} as default } from '${moduleSpecifier}';`,
      });
      definition = formatLinksInDefinitionParts(generatedDefinition);
    } catch (err) {
      if (err instanceof Error && err.message.includes("No properties found")) {
        // nextra throws an Error with message 'No properties found...' when no props are found on a declaration type
        // See https://github.com/shuding/nextra/blob/main/packages/nextra/src/server/tsdoc/base.ts#L126
        // In most cases, `typeHasCustomProperties` guard would make sure that this never reaches to this point,
        // but in case it fails to do so, we catch the error and ignore it.
      } else {
        throw err;
      }
    }
  }

  const rawMdx = createRawMdxForApi(apiExport, definition);
  const rawJs = await compileMdx(rawMdx);
  const page = evaluate(rawJs, mdxComponents, { definition });
  page.metadata.filePath = ""; // keeping this empty string since this is auto-generated, no file exists for it.

  return page;
});

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

  const escapeGenerics = (text: string): string => {
    // Split by backticks so that we don't accidently escape anything inside inline code blocks.
    return text
      .split(/(`[^`]*`)/)
      .map((part, i) => {
        if (i % 2 === 1) return part; // Inside backticks, keep as is
        // Escape < and > to prevent MDX from treating generics as HTML/JSX tags
        return part.replace(/</g, "&lt;").replace(/>/g, "&gt;");
      })
      .join("");
  };

  const processValue = <T>(value: T, key: string | null): T => {
    if (isString(value)) {
      // skip "type" and "name" as they are rendered directly as code/text elements by React
      if (key === "type" || key === "name") return value;
      // process other keys
      return escapeGenerics(trimLinkTrailingSpaces(value)) as T;
    }

    if (Array.isArray(value)) {
      return value.map((v) => processValue(v, key)) as T;
    }

    if (isPlainObject(value)) {
      const newObj: StringKeyedObject = {};
      for (const k in value) {
        newObj[k] = processValue(value[k], k);
      }
      return newObj as T;
    }

    // return other values as it is
    return value;
  };

  return processValue(definition, null);
}
