# JSOC

JSOC is a framework-agnostic system that converts any JSON data into fully functional UI components.  

It is designed to support React, Vue, Angular, Svelte, and more — all powered by a shared core.

This repository uses a modular workspace structure so each framework implementation stays clean, consistent, and scalable.

---

## Monorepo Structure

    jsoc/
    ├─ pnpm-workspace.yaml
    ├─ package.json
    └─ packages/
        ├─ @jsoc/core/      # Framework-independent logic
        └─ @jsoc/react/     # React component adapter layer

Each package is isolated, can be built independently, and shares common core functionality.

---

## @jsoc/core

- Framework-agnostic, pure TypeScript logic.
- Never imports React, Vue, DOM, or UI libraries.
- Contains:
  - Helpers for Grid generation
    - Columns generator
    - Rows generator
    - Methods to mutate the Grid Schema Store

  - Utility functions


---

## @jsoc/react

- React-specific implementation built on top of @jsoc/core.
- This is the UI bridge between JSON data and real React components.

- Available Components: 
  - JsocGrid: Wrapper component that the end consumer will import and render.
    - JsocGridMui: Adapter for MUI DataGrid
    - JsocGridAg: Adapter for AG-Grid




---

## Folder Structure

Packages folder contains the NPM packages.

    packages/
        @jsoc/core/
        @jsoc/react/
        @jsoc/vue - FUTURE
        @json/angular - FUTURE

Each package other than @jsoc/core, will contain set of components for a framework.
```
@jsoc/core
  grid/
    adapters/
      mui/
      ag/
```

---

## Getting Started (Development)

1. Install dependencies via PNPM (jsoc is a monorepo built using PNPM workspace)
  - pnpm install

2. Navigate into a package during development
  - `cd packages/@jsoc/core` or  `cd packages/@jsoc/react`

---


## Documentation
  
To be added in the /docs folder.

---

## Contributing

Contributions are welcome!
Refer docs/CONTRIBUTING.md

---

## License

MIT License — free to use, modify, and distribute.
