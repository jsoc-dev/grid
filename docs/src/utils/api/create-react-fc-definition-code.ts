export type CreateReactFCDefinitionCodeOptions = {
  /**
   * The exact name of the named export to document.
   * If omitted, the component will document the `default` export of the module.
   * @example "Cards"
   */
  namedExport?: string;
  /**
   * The import specifier used to locate the component (usually a relative path or package name).
   * @example "./src/components/Cards.tsx"
   */
  moduleSpecifier: string;
  /**
   * Optional string representing a native HTML element tag (e.g. "button", "div").
   * If provided, all native HTML properties for this element will be visually grouped
   * into a single `...props` row in the API table to prevent cluttering the documentation.
   * @example "button"
   */
  groupNativePropsForElement?: string;
  /**
   * Keys to strictly exclude from the grouping bucket.
   * Useful if you explicitly override a native property (like `children` or `className`)
   * and want it to appear as its own dedicated row in the API table.
   * @example ["children", "className"]
   */
  excludeFromGrouping?: string[];
};

export function createReactFCDefinitionCode(options: CreateReactFCDefinitionCodeOptions) {
  const { namedExport, moduleSpecifier, groupNativePropsForElement } = options;

  // If a named export is provided, we might need to handle nested components (like "Cards.Card").
  // The import must use the top-level name ("Cards"), while ComponentProps uses the full path ("Cards.Card").
  const importName = namedExport ? namedExport.split(".")[0] : "DefaultExport";
  const targetComponent = namedExport ?? "DefaultExport";

  const importStatement = namedExport
    ? `import { ${importName} } from '${moduleSpecifier}';`
    : `import DefaultExport from '${moduleSpecifier}';`;

  // By default, we just extract the standard React props of the requested component.
  let typeLogic = `type DefinitionType = ComponentProps<typeof ${targetComponent}>;`;

  if (groupNativePropsForElement) {
    // If the component inherits hundreds of native HTML attributes (like a <button>),
    // we omit those native attributes from the top-level type and group them into
    // a single \`...props\` row to prevent the API table from becoming cluttered.
    const hasExclusions =
      options.excludeFromGrouping && options.excludeFromGrouping.length > 0;
    const excludeString = hasExclusions
      ? options.excludeFromGrouping!.map((k) => `"${k}"`).join(" | ")
      : "never";

    const nativePropsType = hasExclusions
      ? `Omit<NativeProps, ${excludeString}>`
      : "NativeProps";

    // Why use \`ExtractExactKeys\` instead of just checking if the prop exists on \`OriginalProps\`?
    // Because TypeScript flattens intersections (e.g., \`ButtonProps & { children: ReactNode }\`).
    // Once merged, TypeScript forgets whether a property was inherited or explicitly written.
    // By checking if the *type* of the property changed (\`IsEqual\`), we can cleverly detect 
    // which native properties the developer explicitly overrode and exclude them from grouping!
    typeLogic = `
import type { IsEqual, ExtractExactKeys } from '@jsoc/utils';

type OriginalProps = ComponentProps<typeof ${targetComponent}>;
type NativeProps = ComponentProps<"${groupNativePropsForElement}">;

type GroupedKeys = Exclude<ExtractExactKeys<OriginalProps, NativeProps>, ${excludeString}>;

type DefinitionType = Omit<OriginalProps, GroupedKeys> & { 
  '...props': ${nativePropsType} 
};`;
  }

  // Assemble the final dummy TypeScript file that will be evaluated by ts-morph.
  const code = `
import type { ComponentProps } from 'react';
${importStatement}
${typeLogic}
export default DefinitionType;`;

  return code;
}
