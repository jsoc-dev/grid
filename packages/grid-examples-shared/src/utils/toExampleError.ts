import { isError } from "@jsoc/utils";

export function toExampleError(error: unknown): Error {
  return isError(error)
    ? error
    : new Error("Something went wrong", { cause: error });
}
