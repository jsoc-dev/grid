import type {
  ApiExport,
  GenerateDefinitionResult,
} from "@/utils/api/api-reference-types";
import { isNonEmptyString } from "@jsoc/utils";
import { Node } from "ts-morph";

export function createRawMdxForApi(
  apiExport: ApiExport,
  definition?: GenerateDefinitionResult,
) {
  const definitionTags = definition?.tags;
  const { name: exportName, declaration } = apiExport;
  const isClass = Node.isClassDeclaration(declaration);
  const isFunction = Node.isFunctionDeclaration(declaration);
  const isType =
    Node.isTypeAliasDeclaration(declaration) ||
    Node.isInterfaceDeclaration(declaration);

  const keyword = isClass ? "class" : isFunction ? "function" : "type";
  const specTitle = isClass ? "Members" : isFunction ? "Signature" : "Fields";
  const declarationCode = `\`\`\`ts\n${declaration.getText()}\n\`\`\``;

  const blocks = [
    // title
    `# \`${exportName}\` ${keyword}`,

    // description
    definition && definition.description,

    // declaration (for type aliases/interfaces only)
    isType
      ? definition
        ? `<details>\n<summary>View Declaration</summary>\n\n${declarationCode}\n\n</details>`
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
  ];

  return blocks.filter(isNonEmptyString).join("\n\n");
}
