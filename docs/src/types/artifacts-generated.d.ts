declare module "@/artifacts/generated/package-metadata.json" {
  import type { PackageMetadataArtifact } from "@/artifacts/artifacts-types";

  const packageMetadata: PackageMetadataArtifact;
  export default packageMetadata;
}

declare module "@/artifacts/generated/example-manifests.json" {
  import type { ExampleManifestsArtifact } from "@/artifacts/artifacts-types";

  const exampleManifests: ExampleManifestsArtifact;
  export default exampleManifests;
}

declare module "@/artifacts/generated/api-exports.json" {
  import type { SerializedApiExportArtifact } from "@/artifacts/artifacts-types";

  const apiExports: SerializedApiExportArtifact;
  export default apiExports;
}

declare module "@/artifacts/generated/api-pages.json" {
  import type { ApiPagesArtifact } from "@/artifacts/artifacts-types";

  const apiPages: ApiPagesArtifact;
  export default apiPages;
}
