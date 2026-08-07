# Instructions for AI Agents

## Tools

- This project uses `pnpm` as the package manager. Use `pnpm` commands whenever possible.
- Before committing changes, verify that the commit message and body adhere to [commitlint](commitlint.config.ts) rules:
  - Prefer writing the draft to repo-root [`commit-msg.txt`](commit-msg.txt) (gitignored on purpose — create it locally; do not `git add` it), then `pnpm commitlint:test`
  - Or pipe a draft on stdin: `pnpm commitlint`
  - After committing: `pnpm commitlint -- --last`
- Husky `pre-push` also runs commitlint on the commits being pushed (same rules as CI).
- Commit with the **same** wrapped body you linted. `body-max-line-length` is 100 chars per line; newlines in the lint input do not carry over if you pass one long `-m` string.
  - Do **not** put the whole body in a single `-m "..."` argument.
  - Write `commit-msg.txt`, lint it, then run `git commit -F commit-msg.txt` in a **separate** shell call (message text must not live in the same shell command as the commit — Cursor may inject a `Co-authored-by` `--trailer` into that command; if the text contains `git commit`, the trailer can land in the body and break line length).
  - If workspace file tools cannot create/read `commit-msg.txt` (gitignored / isolated env), write it via the shell instead, or use a path under `.git/` with the same two-step flow.
  - Re-check with `pnpm commitlint -- --last`.

---

## General Code Practices

### Imports

- Follow import/export sorting rules as specified in the root [ESLint config](eslint.config.ts).
- Avoid using relative paths in imports.
- Use absolute paths in the imports using Node Subpath imports if configured in the project's `package.json`.

### TypeScript

- Avoid using 'any' in types/casts/assertions.

---

## Example Apps

- All the example apps are located in [Examples](examples) grouped by frameworks.
- Examples must be pure NPM packages so that they can be also run directly on environments like CodeSandbox/StackBlitz/etc.
- Use NPM supported version specifiers only. Don't use PNPM "catalog:" or "workspace:" in package.json.
