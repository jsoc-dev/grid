import { DeclarationKind } from "@/utils/api/api-declaration";
import type { ApiPackageName } from "@/utils/api/api-packages";

import type {
  GeneratedDefinition,
  GeneratedFunction,
  GeneratedType,
} from "nextra/tsdoc";
import type {
  ExportedDeclarations,
  ClassDeclaration,
  FunctionDeclaration,
  TypeAliasDeclaration,
  InterfaceDeclaration,
} from "ts-morph";

export type GenerateDefinitionResult = GeneratedDefinition &
  (GeneratedFunction | GeneratedType);

type TypeDeclarations = TypeAliasDeclaration | InterfaceDeclaration;
type OtherDeclarations = Exclude<
  ExportedDeclarations,
  ClassDeclaration | FunctionDeclaration | TypeDeclarations
>;

export type ExportedDeclarationsWithKind =
  | (ClassDeclaration & { kind: DeclarationKind.Class })
  | (FunctionDeclaration & {
      kind:
        | DeclarationKind.Composable
        | DeclarationKind.Function
        | DeclarationKind.Hook;
    })
  | (TypeDeclarations & { kind: DeclarationKind.Type })
  | (OtherDeclarations & { kind: DeclarationKind.Other })
  | { kind: DeclarationKind.Unresolved };

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
  declaration: ExportedDeclarationsWithKind;

  /** The name of the package this export belongs to. */
  packageName: ApiPackageName;
};

/**
 * A refinement of {@link ApiExport} that guarantees the source declaration
 * was successfully resolved by the compiler.
 */
export type ResolvedApiExport = ApiExport & {
  declaration: Exclude<
    ApiExport["declaration"],
    { kind: DeclarationKind.Unresolved }
  >;
};
