export function isError(arg: unknown): arg is Error {
  return arg instanceof Error;
}
