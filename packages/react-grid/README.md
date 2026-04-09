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
- ...and others

> [!IMPORTANT]
> These dependencies are **optional**.
> This package **does NOT have any runtime dependency** on them. They are used in this package only for creating **TypeScript types**.
>
> However, if your project uses TypeScript, you will need to install the specific package(s) for your chosen grid plugin to ensure successful compilation.
>
> For example: If you are using plugin for AG-Grid then you need to install `ag-grid-react` + `ag-grid-community`. Or if you are using plugin for MUI DataGrid then you need to install `@mui/x-data-grid` and so on.
