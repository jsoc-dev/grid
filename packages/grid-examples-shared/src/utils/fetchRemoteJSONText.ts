import { isError } from "@jsoc/utils";

export async function fetchRemoteJSONText(
  url: string,
  signal?: AbortSignal,
): Promise<string> {
  const response = await fetch(url, { signal });
  return response.text();
}

export function toFetchRemoteJSONError(maybeError: unknown): Error {
  return isError(maybeError)
    ? maybeError
    : new Error("Failed to fetch the data.", { cause: maybeError });
}
