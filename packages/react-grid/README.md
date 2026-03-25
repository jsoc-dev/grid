# @jsoc/react-grid

Package for generating runtime props for a React Grid Component such as AG-Grid, MUI DataGrid, etc. directly from a response data (JSON).

## Installation

```bash
npm install @jsoc/react-grid
```

## Peer Dependencies (required)

- `react`
- `react-dom`

> [!TIP]
> Refer to `package.json` for exact version ranges.

## Peer Dependencies (optional)

- `@mui/x-data-grid`
- `@tanstack/react-table`
- `ag-grid-react`
- `ag-grid-community`
- `mantine-react-table`

> [!IMPORTANT]
> These dependencies are **optional**.
> This package **does NOT have any runtime dependency** on them.
> They are used in this package only for creating **TypeScript types** (e.g., `PluginConfig`, grid-specific typings, etc.).

### When do you need them?

- Usually you might have already installed these optional peer dependencies.
- For example: If you are using AG-Grid then you might have already installed `ag-grid-react` + `ag-grid-community`. Or if you are using MUI DataGrid then you might have already installed `@mui/x-data-grid`.
