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

- Please follow [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) specification. This is enforced by [commitlint](https://commitlint.js.org/) via a Husky hook. Refer to examples below:

  | Change Type           | Commit Type | Example                                                         |
  | :-------------------- | :---------- | :-------------------------------------------------------------- |
  | **New Feature**       | `feat`      | `feat(core): add new feature`                                   |
  | **Bug Fix**           | `fix`       | `fix(react): resolve bug`                                       |
  | **Documentation**     | `docs`      | `docs: update contribution guide`                               |
  | **Style Changes**     | `style`     | `style: fix indentation in config`                              |
  | **Code Refactor**     | `refactor`  | `refactor(core): rename variable for clarity`                   |
  | **Performance**       | `perf`      | `perf: optimized query execution`                               |
  | **Testing**           | `test`      | `test(core): add unit tests` or `test: cover edge case in grid` |
  | **Build System**      | `build`     | `build: update tsconfig.json` or `build: modify vite config`    |
  | **CI/CD**             | `ci`        | `ci: add github action for tests`                               |
  | **Chore/Maintenance** | `chore`     | `chore: update eslint rules` or `chore: add .gitignore entry`   |
  | **Revert**            | `revert`    | `revert: "feat: add temporary logging"`                         |

- This project uses [Husky](https://typicode.github.io/husky/) to run automated checks:
  - `pre-commit`: Runs lint checks and formatting via [lint-staged](https://github.com/lint-staged/lint-staged) (using [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/)).
  - `commit-msg`: Validates the commit message format using [commitlint](https://commitlint.js.org/).
