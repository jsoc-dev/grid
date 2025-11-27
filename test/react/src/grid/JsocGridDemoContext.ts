import type { GridData } from "@jsoc/core/grid";
import type { GridUiAdapterName } from "@jsoc/react/grid";
import { createContext, type Dispatch, type SetStateAction } from "react";



export type JsocGridDemoContext = {
    gridName: string,
    gridData: GridData;
    gridDataError: string;
    gridUi: GridUiAdapterName | '';
    setGridName: Dispatch<SetStateAction<string>>;
    setGridData: Dispatch<SetStateAction<GridData>>;
    setGridDataError: Dispatch<SetStateAction<string>>;
    setGridUi: Dispatch<SetStateAction<GridUiAdapterName | ''>>;
}

export const JsocGridDemoContext = createContext<JsocGridDemoContext>({
    gridName: '',
    gridData: [],
    gridDataError: '',
    gridUi:  '',
    setGridName: () => {},
    setGridData: () => {},
    setGridDataError:  () => {},
    setGridUi:  () => {},
})