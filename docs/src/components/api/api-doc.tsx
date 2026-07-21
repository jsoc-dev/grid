import type { GenerateDefinitionResult } from "@/utils/api/api-reference-types";
import { generateDefinition, TSDoc } from "nextra/tsdoc";

import {
  createReactFCDefinitionCode,
  type CreateReactFCDefinitionCodeOptions,
} from "@/utils/api/create-react-fc-definition-code";

export type ApiDocProps =
  | {
      /** A pre-computed AST definition. Bypasses on-the-fly parsing. */
      definition: GenerateDefinitionResult;
    }
  | {
      /** Options to dynamically generate and parse a dummy file on the fly. */
      options: CreateReactFCDefinitionCodeOptions;
    };

/**
 * Renders an interactive API property table for a TypeScript definition.
 *
 * Can be used in two distinct ways:
 * 1. Passing a pre-computed \`definition\` directly (used by auto-generated \`/api/[name]\` pages for performance).
 * 2. Passing \`options\` to dynamically parse and generate the table on the fly (used for manual \`.mdx\` authoring).
 */
export async function ApiDoc(props: ApiDocProps) {
  let definition: GenerateDefinitionResult | undefined;

  if ("definition" in props) {
    definition = props.definition;
  } else {
    const code = createReactFCDefinitionCode(props.options);
    definition = generateDefinition({ code });
  }

  return <TSDoc definition={definition} typeLinkMap={undefined} />;
}
