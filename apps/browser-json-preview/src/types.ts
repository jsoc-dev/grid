import type { Dispatch, SetStateAction } from "react";

export type View = "raw" | "table";

export type JSONFile = {
  fileName: string;
  json: string;
};

export type UseStateResult<T> = [T, Dispatch<SetStateAction<T>>];
