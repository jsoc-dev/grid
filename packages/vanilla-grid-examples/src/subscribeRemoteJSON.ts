import { REMOTE_DATA_EXAMPLE_URL } from "@jsoc/grid-docs";
import {
  fetchRemoteJSONText,
  toFetchRemoteJSONError,
} from "@jsoc/grid-examples-shared";

export type RemoteJSONState =
  | { status: "loading" }
  | { status: "error"; error: Error }
  | { status: "ready"; data: string };

/**
 * Fetches JSON text from the given URL (defaults to {@link REMOTE_DATA_EXAMPLE_URL}).
 */
export function subscribeRemoteJSON(
  listener: (state: RemoteJSONState) => void,
  url: string = REMOTE_DATA_EXAMPLE_URL,
): () => void {
  let cancelled = false;
  const controller = new AbortController();

  listener({ status: "loading" });

  fetchRemoteJSONText(url, controller.signal)
    .then((data) => {
      if (cancelled) return;
      listener({ status: "ready", data });
    })
    .catch((maybeError) => {
      if (cancelled) return;
      listener({ status: "error", error: toFetchRemoteJSONError(maybeError) });
    });

  return () => {
    cancelled = true;
    controller.abort();
  };
}
