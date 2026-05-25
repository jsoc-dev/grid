# Instructions for AI Agents

## Tools

- This project uses `pnpm` as the package manager. Use `pnpm` commands whenever possible.

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
- Use NPM supported version specifiers only. Don't use PNPM "catalog:" or "workspace:\*" in package.json.
