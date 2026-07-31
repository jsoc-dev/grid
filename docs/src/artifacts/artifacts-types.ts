import type { DeclarationKind } from "@/utils/api/api-declaration";
import type {
  AdapterPackageName,
  ApiPackageName,
  PluginPackageName,
} from "@/utils/api/api-packages";
import type { GenerateDefinitionResult } from "@/utils/api/api-reference-types";
import type { ExampleSourceManifest, PackageJson } from "@jsoc/grid-docs";

export const ARTIFACT_FILES = {
  packageMetadata: "package-metadata.json",
  exampleManifests: "example-manifests.json",
  apiExports: "api-exports.json",
  apiPages: "api-pages.json",
} as const;

/** Parsed `package.json` fields with every key required (empty object when a dependency map is absent). */
export type PackageMetadata = Required<PackageJson>;

export type PackageMetadataArtifact = Record<
  AdapterPackageName | PluginPackageName,
  PackageMetadata
>;

export type ExampleManifestsArtifact = Record<
  PluginPackageName,
  ExampleSourceManifest
>;

export type SerializedApiExport = {
  name: string;
  packageName: ApiPackageName;
};

export type SerializedApiExportsByKind = Partial<
  Record<DeclarationKind, SerializedApiExport[]>
>;

export type SerializedApiExportArtifact = Record<
  ApiPackageName,
  SerializedApiExportsByKind
>;

/** Precompiled MDX (+ optional TSDoc definition) for one API reference page. */
export type PrecomputedApiPage = {
  rawMdx: string;
  definition?: GenerateDefinitionResult;
};

export type ApiPagesArtifact = Record<
  ApiPackageName,
  Record<string, PrecomputedApiPage>
>;
