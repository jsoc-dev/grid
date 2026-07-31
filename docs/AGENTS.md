<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

## Build artifacts

The docs app does not read `packages/` at **request** time. Sidebar, peer-deps, MDX snippets, and API reference pages use precomputed `src/artifacts/generated/*.json`. ts-morph runs only in `generate-artifacts` (via `predev` / `prebuild`).

See [specs/build-artifacts.md](./specs/build-artifacts.md) for the full pipeline, Vercel rationale, and why example manifests exist in both `public/` and `artifacts/generated/`.
