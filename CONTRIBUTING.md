# Contributing

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- [PNPM](https://pnpm.io/) (Refer to the `packageManager` field in [package.json](package.json) for version)

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
- To check a message locally before pushing, pipe it to commitlint or validate the last commit: `pnpm commitlint -- --last` (see [AGENTS.md](AGENTS.md)).
- Locally, [Husky](https://typicode.github.io/husky/) runs `pre-commit` only: lint and format staged files via [lint-staged](https://github.com/lint-staged/lint-staged) (using [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/)).

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
- `examples/vue/basic`
