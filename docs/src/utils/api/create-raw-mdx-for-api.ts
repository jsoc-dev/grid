import {
  getModuleSpecifierRelativeToRoot,
  type CheckDeclarationKindResult,
} from "@/utils/api/api-exports";
import type {
  ResolvedApiExport,
  GenerateDefinitionResult,
  ExportedDeclarationsWithKind,
} from "@/utils/api/api-reference-types";
import { withGithubMainBranchUrl } from "@jsoc/grid-docs";
import { joinNonEmptyStrings } from "@jsoc/utils";

export function createRawMdxForApi(
  apiExport: ResolvedApiExport,
  definition?: GenerateDefinitionResult,
) {
  const { name: exportName, declaration } = apiExport;
  const title = `# \`${exportName}\`` as const;

  const definitionTags = definition?.tags;

  const titleSuffix = getPageTitleSuffix(declaration);
  const specTitle = getSpecificationTitle(declaration, definition);

  const declarationCode = `\`\`\`ts\n${declaration.getText()}\n\`\`\``;

  const declarationSourceUrl = withGithubMainBranchUrl(
    getModuleSpecifierRelativeToRoot(declaration),
  );

  const blocks = [
    // title
    joinNonEmptyStrings([title, titleSuffix], " "),

    // description
    definition && definition.description,

    // declaration (for type aliases/interfaces only)
    declaration.isType
      ? definition
        ? `<details>\n<summary>View Declaration</summary>\n\n${declarationCode}\n\n</details>` // when definition is also available, we show declaration inside a collapsed details element
        : `## Declaration\n\n${declarationCode}`
      : undefined,

    // specification
    definition && `## ${specTitle}\n\n<ApiDoc definition={definition} />`,

    // errors
    definitionTags?.throws &&
      `> [!WARNING]\n>\n> Throws ${definitionTags.throws}`,

    // see
    definitionTags?.see && `**See**\n\n${definitionTags.see}`,

    // example
    definitionTags?.example && `## Example\n\n${definitionTags.example}`,

    // usage
    definitionTags?.usage && `## Usage\n\n${definitionTags.usage}`,

    // source code link
    `---\n\n_This API reference is automatically generated from the [source code](${declarationSourceUrl})._`,
  ];

  return joinNonEmptyStrings(blocks, "\n\n");
}

export function getPageTitleSuffix(declaration?: ExportedDeclarationsWithKind) {
  const { isClass, isFunction, isType, isOther } = declaration || {};

  const suffix = isClass
    ? "class"
    : isFunction
      ? "function"
      : isType
        ? "type"
        : isOther
          ? "" // can be a primitive or a re-export of a class/function/type.
          : ""; // unresolved exports
  return suffix;
}

const SPEC_TITLE_BY_DECLARATION_KIND = {
  class: "Members",
  function: "Signature",
  type: "Fields",
  other: "Properties",
} as const;

export function getSpecificationTitle(
  declaration: ExportedDeclarationsWithKind,
  definition?: GenerateDefinitionResult,
) {
  const { isClass, isFunction, isType, isOther } = declaration;

  return isClass
    ? SPEC_TITLE_BY_DECLARATION_KIND.class
    : isFunction
      ? SPEC_TITLE_BY_DECLARATION_KIND.function
      : isType
        ? SPEC_TITLE_BY_DECLARATION_KIND.type
        : isOther && definition // can be a primitive or a re-export of a class/function/type.
          ? getSpecificationTitleByDefinition(definition)
          : SPEC_TITLE_BY_DECLARATION_KIND.other;
}

function getSpecificationTitleByDefinition(
  definition: GenerateDefinitionResult,
) {
  return "signatures" in definition
    ? SPEC_TITLE_BY_DECLARATION_KIND.function
    : SPEC_TITLE_BY_DECLARATION_KIND.other;

  // we can't narrow it further by checking `"entries" in definition`.
  // Nextra's TSdoc parser strips away the "Class-ness" of an object.  If an AST node is a variable or re-export
  // but its underlying type is a Class, Nextra will parse it exactly like an Interface and return an `entries` object
  // containing its fields/methods. Because of this, it is structurally impossible to distinguish a Class from an Interface
  // purely from `GenerateDefinitionResult`.
}
