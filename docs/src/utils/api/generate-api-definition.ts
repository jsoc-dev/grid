import type {
  ApiExport,
  GenerateDefinitionResult,
} from "@/utils/api/api-reference-types";
import {
  getModuleSpecifierRelativeToDocs,
  isResolvedApiExport,
} from "@/utils/api/api-exports";
import { generateDefinition, type Tags, type TypeField } from "nextra/tsdoc";
import {
  Node,
  type InterfaceDeclaration,
  type TypeAliasDeclaration,
} from "ts-morph";

const cache = new Map<string, GenerateDefinitionResult | undefined>();

// FIXME: Props param for components is named as _0 (http://localhost:3000/api/react-grid/ChildGridToggle)
export async function generateApiDefinition(
  apiExport: ApiExport,
): Promise<GenerateDefinitionResult | undefined> {
  const cacheKey = `${apiExport.packageName}/${apiExport.name}`;

  if (cache.has(cacheKey)) return cache.get(cacheKey);

  if (!isResolvedApiExport(apiExport)) return updateCache(cacheKey, undefined);

  const { declaration } = apiExport;

  const shouldGenerateDefinition =
    Node.isTypeAliasDeclaration(declaration) ||
    Node.isInterfaceDeclaration(declaration)
      ? typeHasCustomProperties(declaration)
      : true;

  let definition: GenerateDefinitionResult | undefined = undefined;

  if (shouldGenerateDefinition) {
    try {
      // We want the relative path from the monorepo root to properly instruct ts-morph downstream.
      // However, Nextra's TS morph instance in generate-api-reference uses CWD=docs.
      // So the path should be relative to `docs`.
      const moduleSpecifier = getModuleSpecifierRelativeToDocs(declaration);
      definition = generateDefinition({
        code: `export { ${apiExport.name} as default } from '${moduleSpecifier}';`,
      });
      definition = formatLinksInDefinitionParts(definition);
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

  return updateCache(cacheKey, definition);
}

function updateCache(key: string, value: GenerateDefinitionResult | undefined) {
  cache.set(key, value);
  return value;
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

  const formatText = (text: string): string => {
    return escapeGenerics(trimLinkTrailingSpaces(text));
  };

  const formatTags = (tags: Tags | undefined) => {
    if (!tags) return;
    for (const tag in tags) {
      tags[tag] = formatText(tags[tag]);
    }
  };

  // Mutate the root definition
  if (definition.description) {
    definition.description = formatText(definition.description);
  }
  formatTags(definition.tags);

  const formatTypeField = (field: TypeField) => {
    if (field.description) field.description = formatText(field.description);
    formatTags(field.tags);
  };

  // Mutate entries (classes/interfaces)
  if ("entries" in definition && Array.isArray(definition.entries)) {
    for (const entry of definition.entries) {
      formatTypeField(entry);
    }
  }

  // Mutate signatures (functions)
  if ("signatures" in definition && Array.isArray(definition.signatures)) {
    for (const signature of definition.signatures) {
      if (Array.isArray(signature.params)) {
        for (const param of signature.params) {
          formatTypeField(param);
        }
      }
      if (Array.isArray(signature.returns)) {
        for (const ret of signature.returns) {
          formatTypeField(ret as TypeField);
        }
      }
    }
  }

  return definition;
}
