# JSOC — JavaScript Object -> Component <{}>

JSOC is a framework-agnostic system that converts any JSON configuration into fully functional UI components.  
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

Framework-agnostic, pure TypeScript logic.

Contains:
- JSON → Schema parsing
- Component resolver
- Internal data normalization
- Type definitions
- Utility functions

Never imports React, Vue, DOM, or UI libraries.

---

## @jsoc/react

React-specific implementation built on top of @jsoc/core.

Contains:
- JsocGrid (with adapters: MUI, AG Grid, TanStack)
- JsocChart (with adapters: Recharts, Nivo)
- JsocForm (with adapters: MUI, Headless UI)
- Rendering hooks
- Adapter abstraction layer

This is the UI bridge between JSON schema and real React components.

---

## Folder Structure

See full folder structure in:
`docs/FOLDER_STRUCTURE.md`

Key idea:

    packages/
        @jsoc/core/
        @jsoc/react/

Adapters are grouped by component type and UI library:

grid/
  adapters/
    mui/
    ag-grid/
    tanstack/

---

## Getting Started (Development)

1. Install dependencies
pnpm install

2. Navigate into a package during development
cd packages/@jsoc/core
or
cd packages/@jsoc/react

3. No builds needed during early development  
You can work using raw TypeScript imports.

---

## Development Philosophy

JSOC follows a clean architecture:

Core:
- Schema parsing
- Node resolution
- Validation
- Utilities

Framework Layer (React / Vue / Angular):
- Adapter mapping
- Rendering logic
- Props and events binding

Adapter Layer (MUI, AG Grid, Recharts, etc.):
- Component-specific prop translation
- Normalized props → actual UI props
- Final rendering

This separation makes JSOC:
- reusable
- framework-agnostic
- easy to extend
- easy to test

---

## Planned Frameworks

Future packages will follow same structure:

    packages/
        @jsoc/core/
        @jsoc/react/
        jsoc-vue/
        jsoc-angular/
        jsoc-svelte/

---

## Naming Conventions

- Public components must be prefixed with "Jsoc*"
  Example: JsocGrid, JsocChart, JsocForm

- Internal adapters should not use the prefix
  Example: MUIGridAdapter, RechartsAdapter

---

## Documentation

See the /docs folder:

- docs/FOLDER_STRUCTURE.md
- docs/ARCHITECTURE.md
- docs/CONTRIBUTING.md
- docs/ROADMAP.md

---

## Contributing

Contributions are welcome!

Focus areas include:
- new adapter libraries (MUI, Chakra, Tailwind)
- new framework packages (Vue, Angular)
- core parser improvements
- documentation

---

## License

MIT License — free to use, modify, and distribute.
