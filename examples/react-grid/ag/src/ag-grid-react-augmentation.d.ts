import { Component, type ReactNode } from "react";
import type { AgGridReactProps } from "ag-grid-react";

// ag-grid-react (v35) is compiled against React 18 typings, which causes its
// `AgGridReact` class to lack the strict properties expected by React 19's `JSX.ElementClass`.
// This module augmentation bridges the gap by explicitly extending React 19's `Component`
// and defining the `props` shape so that the IDE and TypeScript compiler accept it as a valid JSX element.
declare module "ag-grid-react" {
  export interface AgGridReact<TData = unknown> extends Component<
    AgGridReactProps<TData>,
    object
  > {
    props: AgGridReactProps<TData> & { children?: ReactNode };
  }
}
