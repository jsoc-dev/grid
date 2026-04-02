export function isNumber(arg: unknown): arg is number {
  return typeof arg === "number";
}

export function isFiniteNumber(arg: unknown): arg is number {
  return Number.isFinite(arg);
}
