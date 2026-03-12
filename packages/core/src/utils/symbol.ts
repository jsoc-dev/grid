import { toStringSafe } from "#utils/index.ts";

export function isSymbol(arg: unknown): arg is symbol {
  return typeof arg === "symbol";
}

export function trimSymbol(arg: symbol): string {
  return toStringSafe(arg).replace(/^Symbol\((.*)\)$/, "$1");
}
