# Docs build artifacts

The docs site precomputes data at build time and bundles it into the Next.js app. Runtime code imports typed JSON instead of reading the monorepo filesystem. This keeps local dev and Vercel serverless deployments consistent.

## Why

On Vercel, serverless functions run from a trimmed deployment bundle (`/var/task`). Paths like `../packages` or ad-hoc reads from `public/` are unreliable at request time. API reference generation (ts-morph) and example source manifests used to depend on those reads.

The fix: generate JSON artifacts during `predev` / `prebuild`, import them as modules, and ship them inside the server bundle.

## Build pipeline

```
examples/                    build-examples (repo root)
    │
    ▼
docs/public/examples/        Vite builds + per-plugin source-manifest.json
    │
    ▼
docs/src/artifacts/generated/  generate-artifacts (docs package)
    │
    ▼
Next.js build                imports typed JSON from artifacts/generated
```

| Step              | Command                    | Runs from | Output                                                                        |
| ----------------- | -------------------------- | --------- | ----------------------------------------------------------------------------- |
| 1. Example apps   | `pnpm build-examples`      | repo root | Built assets + `docs/public/examples/<adapter>/<plugin>/source-manifest.json` |
| 2. Docs artifacts | `pnpm generate-artifacts`  | `docs/`   | `docs/src/artifacts/generated/*.json`                                         |
| 3. Docs site      | `pnpm --filter docs build` | `docs/`   | `.next/`                                                                      |

Vercel (`docs/vercel.json`) runs `pnpm build-full` from the docs package (Root Directory = `docs`).

`generate-artifacts` also runs automatically before `dev` and `build` in the docs package (`pre*` hooks). It runs two steps:

1. `tsx scripts/generate-artifacts.ts` — metadata, example manifests, API export sidebar data
2. `node -r ./scripts/stub-server-only.cjs --import tsx scripts/generate-api-pages-artifact.ts` — precompiled API page MDX (requires Nextra TSDoc; uses `scripts/stub-server-only.cjs` and `scripts/mdx-import-source-stub.tsx` outside the Next.js bundler)

## Generated artifacts

All JSON files live in `docs/src/artifacts/generated/` (gitignored). Filenames are defined in `docs/src/artifacts/types.ts` as `ARTIFACT_FILES`.

| Artifact                 | Generator source                               | Import path                                    | Primary consumers                                   |
| ------------------------ | ---------------------------------------------- | ---------------------------------------------- | --------------------------------------------------- |
| `package-metadata.json`  | `packages/*/package.json`                      | `@/artifacts/generated/package-metadata.json`  | `getPackageMetadata`, peer-deps UI                  |
| `example-manifests.json` | `docs/public/examples/**/source-manifest.json` | `@/artifacts/generated/example-manifests.json` | `getCachedExampleManifest`, MDX snippet extraction  |
| `api-exports.json`       | ts-morph over `packages/`                      | `@/artifacts/generated/api-exports.json`       | `generate-api-page-map`, `/api/[packageName]` index |
| `api-pages.json`         | ts-morph + Nextra TSDoc over `packages/`       | `@/artifacts/generated/api-pages.json`         | `/api/[packageName]/[apiName]` pages                |

### package-metadata.json

**What:** `name`, `version`, `dependencies`, `devDependencies`, and `peerDependencies` for each adapter and plugin package.

**Why:** Docs pages show install commands and peer dependency tables without opening `package.json` files at runtime.

### api-exports.json

**What:** Exported symbols per API package, grouped by declaration kind (function, type, class, …). Each entry has `name` and `packageName` only.

**Why:** The API reference sidebar and package index pages are built from this list. Values are a JSON-safe subset of `getApiExports()` from `api-exports.ts` (name and `packageName` only).

### api-pages.json

**What:** Precompiled MDX (and optional Nextra TSDoc `definition` JSON) per API export page.

**Why:** `next build` only runs `compileMdx` + `evaluate` on the precomputed MDX. ts-morph and `generateDefinition` run once in `generate-artifacts`, not again during the Next.js build.

### example-manifests.json

**What:** Flat map of plugin package name → `ExampleSourceManifest` (e.g. `"react-grid-ag"`).

**Why:** Server-side MDX rendering resolves snippet tokens from example source without filesystem access. See [Example manifests (two copies)](#example-manifests-two-copies) below.

## Type contract

Generator and readers share types from `docs/src/artifacts/types.ts`:

- **Generator** (`docs/scripts/generate-artifacts.ts`) builds values typed as `PackageMetadataArtifact`, `ExampleManifestsArtifact`, `SerializedApiExportArtifact`, or `ApiPagesArtifact`, then writes JSON with `JSON.stringify`.
- **Consumers** import JSON modules typed by `docs/src/types/artifacts-generated.d.ts`.

When adding a field or a new artifact:

1. Extend the type in `artifacts/types.ts`.
2. Update the generator to populate it.
3. Add a module declaration in `src/types/artifacts-generated.d.ts`.
4. Run `pnpm generate-artifacts`.

Do not hand-edit files in `src/artifacts/generated/`.

## Example manifests (two copies)

Example source exists in two places. The **content** overlaps; the **work** does not.

| Location                                              | Produced by                                                | Consumed by                               | Delivery                    |
| ----------------------------------------------------- | ---------------------------------------------------------- | ----------------------------------------- | --------------------------- |
| `docs/public/examples/.../source-manifest.json`       | `emitExampleSourceManifest` in `scripts/build-examples.ts` | Client `useExampleSource` (Code Explorer) | Static `fetch()` per plugin |
| `docs/src/artifacts/generated/example-manifests.json` | `generate-artifacts` (reads public files)                  | Server `getCachedExampleManifest`         | Bundled JSON import         |

**Why two copies?**

- **Client** needs on-demand, per-plugin manifests. Fetching one `source-manifest.json` avoids loading every example into the browser.
- **Server** cannot rely on reading `public/` at runtime on Vercel. Importing a pre-merged artifact bundles the data into the server build.

**What is duplicated vs not:**

- Duplicated: JSON on disk (same manifest content in two shapes/locations).
- Not duplicated: transpilation and manifest construction — that happens only in `emitExampleSourceManifest`. `generate-artifacts` only reads and merges existing JSON.

A future simplification could pass manifest data from server components into Code Explorer and drop the public copies, at the cost of a larger UI refactor.

## Related code (repo root)

These stay at the repo root because they operate on `examples/` and `packages/`, not only on the docs app:

| File                                         | Role                                                               |
| -------------------------------------------- | ------------------------------------------------------------------ |
| `scripts/build-examples.ts`                  | Vite-builds example apps into `docs/public/examples/`              |
| `scripts/utils/emitExampleSourceManifest.ts` | Builds per-plugin `source-manifest.json` from example source trees |

## Related specs

- [Example snippets](./content/example-snippets.md) — how MDX uses manifests for `#region` snippet extraction
