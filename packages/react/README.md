# @jsoc/react

Package for generating runtime props for a React Grid Component such as AG-Grid, MUI DataGrid, etc. directly from a response data (JSON).

## Installation

```bash
npm install @jsoc/react
```

## Peer Dependencies

- `@mui/x-data-grid`
- `ag-grid-react`
- `ag-grid-community`

### Important

- These dependencies are **optional**.
- This package **does NOT have any runtime dependency** on them.
- They are used in this package only for creating **TypeScript types** (e.g., `PluginConfig`, grid-specific typings, etc.).

## When do you need them?

You only need to install one of the following **when you actually use that grid implementation**:

- `@mui/x-data-grid` → if using MUI-based grid plugins
- `ag-grid-react` + `ag-grid-community` → if using AG Grid plugins

If you're rendering a grid plugin → you will have the required package installed anyway.

## Example

```ts
import { useStore } from "@jsoc/react/grid";
```

## Notes

- Designed to be **grid-agnostic**
- Supports multiple grid implementations via plugins
- Keeps runtime lightweight by avoiding direct dependencies
