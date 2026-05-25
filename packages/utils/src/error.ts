export function isError(arg: unknown): arg is Error {
  return arg instanceof Error;
}

export function ensureError(arg: unknown, msg?: string): Error {
  return isError(arg)
    ? arg
    : new Error(msg ?? "An unknown error occurred.", { cause: arg });
}
