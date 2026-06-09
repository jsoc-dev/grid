import {
  fetchRemoteData,
  type FetchState,
  pendingState,
  REMOTE_DATA_EXAMPLE_URL,
} from "@jsoc/grid-examples-shared";
import { useEffect, useState } from "react";

/**
 * Fetches data from the given URL and returns reactive fetch state.
 * If `url` is not provided, it defaults to {@link REMOTE_DATA_EXAMPLE_URL}.
 */
export const useFetchRemoteData = (
  url: string = REMOTE_DATA_EXAMPLE_URL,
): FetchState => {
  const [state, setState] = useState<FetchState>(pendingState);

  useEffect(() => {
    return fetchRemoteData(url, setState);
  }, [url]);

  return state;
};
