import type { GeneratedDefinition, GeneratedFunction, GeneratedType } from "nextra/tsdoc";
import type { ExportedDeclarations } from "ts-morph";

export type ApiPackageName = "grid-core" | "react-grid" | "vanilla-grid" | "vue-grid";

export type GenerateDefinitionResult = GeneratedDefinition &
  (GeneratedFunction | GeneratedType);

export type ApiExport = {
  // name of the export
  name: string;
  // first declaration of this export
  declaration: ExportedDeclarations;
}
