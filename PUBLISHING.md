# Publishing packages

This monorepo publishes npm packages under the `@jsoc` scope using [Changesets](https://github.com/changesets/changesets). Packages are built with [tsdown](https://github.com/rolldown/tsdown) before publish.

---

## Publishable packages

All packages under `packages/` are published to npm. They are **not** private and use `"access": "public"` in [.changeset/config.json](.changeset/config.json).

### Core

| Package           | Description                      |
| ----------------- | -------------------------------- |
| `@jsoc/utils`     | Shared utility functions         |
| `@jsoc/grid-core` | Framework-agnostic grid logic    |
| `@jsoc/grid-docs` | Docs-site utilities and metadata |

### Framework adapters

| Package              | Description        |
| -------------------- | ------------------ |
| `@jsoc/react-grid`   | React adapter      |
| `@jsoc/vue-grid`     | Vue adapter        |
| `@jsoc/vanilla-grid` | Vanilla JS adapter |

### Shared plugin code

| Package                      | Description                      |
| ---------------------------- | -------------------------------- |
| `@jsoc/grid-ag-shared`       | AG Grid column generators        |
| `@jsoc/grid-tanstack-shared` | TanStack Table column generators |

### Plugins

| Package                       | Description                          |
| ----------------------------- | ------------------------------------ |
| `@jsoc/react-grid-ag`         | AG Grid plugin for React             |
| `@jsoc/react-grid-ant`        | Ant Design plugin for React          |
| `@jsoc/react-grid-mantine`    | Mantine plugin for React             |
| `@jsoc/react-grid-mui`        | MUI plugin for React                 |
| `@jsoc/react-grid-prime`      | PrimeReact plugin for React          |
| `@jsoc/react-grid-tanstack`   | TanStack Table plugin for React      |
| `@jsoc/vue-grid-ag`           | AG Grid plugin for Vue               |
| `@jsoc/vue-grid-tanstack`     | TanStack Table plugin for Vue        |
| `@jsoc/vanilla-grid-ag`       | AG Grid plugin for Vanilla JS        |
| `@jsoc/vanilla-grid-tanstack` | TanStack Table plugin for Vanilla JS |

### Example utilities

Shared code used by standalone example apps and the docs site.

| Package                       | Description                    |
| ----------------------------- | ------------------------------ |
| `@jsoc/grid-examples-core`    | Core example utilities and CSS |
| `@jsoc/react-grid-examples`   | React example utilities        |
| `@jsoc/vue-grid-examples`     | Vue example utilities          |
| `@jsoc/vanilla-grid-examples` | Vanilla JS example utilities   |

---

## Overview

1. During development, TypeScript sources are resolved via the top-level `exports` field (usually `"./src/index.ts"`).
2. **Publish** uses `publishConfig` to point consumers at compiled output in `dist/`.
3. `files` limits what ships in the tarball (usually `dist`, or `dist` plus `src/css/` for `@jsoc/grid-examples-core`).
4. Packages are built and released by [release workflow](#release-workflow).

---

## Root scripts reference

| Script             | Command                                    | Purpose                              |
| ------------------ | ------------------------------------------ | ------------------------------------ |
| `build-packages`   | `tsx scripts/build-packages.ts`            | Build all packages under `packages/` |
| `changeset`        | `changeset`                                | Create a new changeset               |
| `version-packages` | `changeset version`                        | Apply changesets and bump versions   |
| `release`          | `pnpm build-packages && changeset publish` | Build and publish to npm             |

---

## Release workflow

### 1. Land changes on `main`

Run checks before releasing:

```bash
pnpm install
pnpm typecheck
pnpm lint
pnpm build-packages
```

### 2. Add a changeset

When a PR includes user-facing changes to publishable packages, add a changeset:

```bash
pnpm changeset
```

- Select the affected packages.
- Choose the bump type (`patch`, `minor`, or `major`).
- Write a short changelog summary.

This creates a file in `.changeset/`. Commit it with the PR.

Changesets automatically bumps dependent packages (`updateInternalDependencies: "patch"`).

### 3. Version packages

On `main`, after changesets have been merged:

```bash
pnpm version-packages
```

This runs `changeset version`, which:

- Bumps `version` in affected `package.json` files
- Updates `CHANGELOG.md` files
- Rewrites `workspace:*` dependency ranges to real semver ranges
- Removes consumed changeset files

Commit the result (often as a "Version packages" PR). Follow [conventional commits](https://www.conventionalcommits.org/) and validate the message with commitlint before committing:

```bash
pnpm commitlint   # pipe the draft message on stdin
```

### 4. Build and publish

From the repo root, after versions have been bumped and committed:

**Quick path** — build every package and publish anything not already on npm:

```bash
pnpm release
```

---

**Step-by-step path** — use this when you want to inspect tarballs before publishing:

**a. Build**

```bash
pnpm build-packages
```

**b. Verify tarballs** (optional; repeat per package)

```bash
cd packages/grid-core
npm pack --dry-run
```

Check that:

- Compiled packages list `dist/` in the tarball, not raw `src/`
- `@jsoc/grid-examples-core` includes both `dist/` and `src/css/`
- Entry points in `publishConfig.exports` match what consumers import

**c. Publish**

```bash
pnpm changeset publish
```

### 5. Push to remote

Push the version commit and tags created by Changesets:

```bash
git push --follow-tags
```

---
