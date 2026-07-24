import type { ApiPackageName } from "@/utils/api/api-packages";
import type {
  GeneratedDefinition,
  GeneratedFunction,
  GeneratedType,
} from "nextra/tsdoc";
import type { ExportedDeclarations } from "ts-morph";

export type GenerateDefinitionResult = GeneratedDefinition &
  (GeneratedFunction | GeneratedType);

/**
 * Represents an exported member (a class, function, type, primitive
 * value, or a re-export of one of them) from a package.
 */
export type ApiExport = {
  /** The name of the export. */
  name: string;

  /**
   * The first resolved declaration of this export.
   *
   * This can be `undefined` if TS-morph is unable to resolve the export
   * (e.g., when re-exporting a component from a `.vue` file).
   */
  declaration: ExportedDeclarations | undefined;

  /** The name of the package this export belongs to. */
  packageName: ApiPackageName;
};
