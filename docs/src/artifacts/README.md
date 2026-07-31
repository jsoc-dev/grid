# Artifacts

Build-time data for the docs app. Do not edit `generated/*.json` manually.

## Regenerate

```bash
pnpm generate-artifacts              # from docs/
pnpm --filter docs generate-artifacts # from repo root
```

Run `pnpm build-examples` first so `docs/public/examples/**/source-manifest.json` exists.

## Layout

| Path                 | Purpose                                     |
| -------------------- | ------------------------------------------- |
| `artifacts-types.ts` | `ARTIFACT_FILES`, artifact TypeScript types |
| `get-*.ts`           | Typed accessors for generated JSON          |
| `generated/*.json`   | Build output (gitignored)                   |

| JSON file                | Contract type                 |
| ------------------------ | ----------------------------- |
| `package-metadata.json`  | `PackageMetadataArtifact`     |
| `example-manifests.json` | `ExampleManifestsArtifact`    |
| `api-exports.json`       | `SerializedApiExportArtifact` |
| `api-pages.json`         | `ApiPagesArtifact`            |

**Generator:** `docs/scripts/generate-artifacts.ts`  
**Consumers:** `import … from "@/artifacts/generated/*.json"` (typed via `src/types/artifacts-generated.d.ts`)

Full architecture: [specs/build-artifacts.md](../../specs/build-artifacts.md).
