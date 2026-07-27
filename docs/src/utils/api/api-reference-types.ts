import type { CheckDeclarationKindResult } from "@/utils/api/api-exports";
import type { ApiPackageName } from "@/utils/api/api-packages";
import type { ExtractTrueVariant } from "@jsoc/utils";
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
  | (ClassDeclaration &
      ExtractTrueVariant<CheckDeclarationKindResult, "isClass">)
  | (FunctionDeclaration &
      ExtractTrueVariant<CheckDeclarationKindResult, "isFunction">)
  | (TypeDeclarations &
      ExtractTrueVariant<CheckDeclarationKindResult, "isType">)
  | (OtherDeclarations &
      ExtractTrueVariant<CheckDeclarationKindResult, "isOther">);

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
  declaration: ExportedDeclarationsWithKind | undefined;

  /** The name of the package this export belongs to. */
  packageName: ApiPackageName;
};

/**
 * A refinement of {@link ApiExport} that guarantees the source declaration
 * was successfully resolved by the compiler.
 */
export type ResolvedApiExport = ApiExport & {
  declaration: NonNullable<ApiExport["declaration"]>;
};
