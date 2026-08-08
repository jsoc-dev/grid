# Contributing

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- [PNPM](https://pnpm.io/) (Refer to the `packageManager` field in [package.json](package.json) for version)

---

## Repository structure

This is a pnpm workspace. Packages are declared in [pnpm-workspace.yaml](pnpm-workspace.yaml).

| Path        | Purpose                                                                                   |
| :---------- | :---------------------------------------------------------------------------------------- |
| `docs/`     | Documentation site (Nextra)                                                               |
| `examples/` | Runnable example apps, grouped by framework (`react-grid/`, `vue-grid/`, `vanilla-grid/`) |
| `packages/` | Published libraries and shared example code                                               |

**Grouped folders** (e.g. `packages/react-grid-plugins/`, `examples/react-grid/`) are organizational only — they must **not** contain a `package.json`. Actual packages live one level below (e.g. `packages/react-grid-plugins/react-grid-ag/`).

When you add a new example framework or package group, add a matching glob to `pnpm-workspace.yaml` (see existing entries for `examples/*/*` and `packages/*/*`).

---

## Development

1. Install dependencies

   ```bash
   pnpm install
   ```

2. Navigate into a package during development. For Example
   ```bash
   cd packages/react-grid
   ```

## Commits

- Please follow [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) specification.
- Commit messages are validated in CI with [commitlint](https://commitlint.js.org/) on pull requests and pushes to `main` (see [.github/workflows/commitlint.yml](.github/workflows/commitlint.yml)).
- If commitlint fails on your pull request, fix the message on your branch with `git commit --amend` or `git history reword` (available in Git 2.54), then push again.
- To check a message locally before pushing, validate the last commit: `pnpm commitlint -- --last`. Agent commit workflow: [AGENTS.md](AGENTS.md).
- Locally, [Husky](https://typicode.github.io/husky/) runs:
  - `pre-commit`: lint and format staged files via [lint-staged](https://github.com/lint-staged/lint-staged) (using [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/)).
  - `pre-push`: [commitlint](https://commitlint.js.org/) on the commits being pushed.

### Commit Types

Refer to the examples below:

| Commit Type | Change Type           | Description                                                                                                                 | Example                                                                  |
| :---------- | :-------------------- | :-------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------- |
| `feat`      | **New Feature**       | Introduces a new feature to the codebase or application.                                                                    | `feat(core): add new feature`                                            |
| `fix`       | **Bug Fix**           | Resolves a bug or issue.                                                                                                    | `fix(react): resolve bug`                                                |
| `docs`      | **Documentation**     | Updates or additions to documentation only.                                                                                 | `docs: update contribution guide`                                        |
| `style`     | **Style Changes**     | Use style if the change only affects code formatting, white space, or visual polish without changing how the feature works. | `style: fix indentation in config`<br>`style: change text color to blue` |
| `refactor`  | **Code Refactor**     | A code change that neither fixes a bug nor adds a feature (e.g., restructuring code).                                       | `refactor(core): rename variable for clarity`                            |
| `perf`      | **Performance**       | A code change specifically aimed at improving performance.                                                                  | `perf: optimized query execution`                                        |
| `test`      | **Testing**           | Adding missing tests or correcting existing tests.                                                                          | `test(core): add unit tests`<br>`test: cover edge case in grid`          |
| `build`     | **Build System**      | Changes affecting the build system, compilers, or external dependencies.                                                    | `build: update tsconfig.json`<br>`build: modify vite config`             |
| `ci`        | **CI/CD**             | Changes to CI/CD configuration files and scripts.                                                                           | `ci: add github action for tests`                                        |
| `chore`     | **Chore/Maintenance** | Maintenance tasks, dependency updates, or changes that don't modify source/test files.                                      | `chore: update eslint rules`<br>`chore: add .gitignore entry`            |
| `revert`    | **Revert**            | Reverts a previous commit.                                                                                                  | `revert: "feat: add temporary logging"`                                  |

### Commit Scopes

Use the published package name for reusable packages:

- `grid`
- `react-grid`
- `grid-docs`
- `grid-examples`

Use the repository path for internal apps and examples:

- `docs`
- `examples`
- `examples/react-grid/ant`
- `examples/vue-grid/ag`
