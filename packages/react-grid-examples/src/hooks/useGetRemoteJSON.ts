import { REMOTE_DATA_EXAMPLE_URL } from "@jsoc/grid-docs";
import {
  fetchRemoteJSONText,
  toFetchRemoteJSONError,
} from "@jsoc/grid-examples-shared";
import { useEffect, useState } from "react";

/**
 * Fetches JSON string from the given URL.
 * - If the URL is not provided, it defaults to {@link REMOTE_DATA_EXAMPLE_URL}.
 * - If the fetch fails, the error state will be set to the caught error.
 */
export const useGetRemoteJSON = (url: string = REMOTE_DATA_EXAMPLE_URL) => {
  const [data, setData] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | false | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    setError(null);
    setData(null);

    fetchRemoteJSONText(url, controller.signal)
      .then((str) => {
        setData(str);
        setError(false);
      })
      .catch((maybeError) => {
        if (controller.signal.aborted) return;
        setError(toFetchRemoteJSONError(maybeError));
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [url]);

  return { data, loading, error };
};
