import { ensureError } from "@jsoc/utils";

export type PendingState = {
  data: undefined;
  error: null;
  isError: false;
  isLoading: true;
};

export type SuccessState = {
  data: string;
  error: null;
  isError: false;
  isLoading: false;
};

export type ErrorState = {
  data: undefined;
  error: Error;
  isError: true;
  isLoading: false;
};

/** The current state of the fetch request. */
export type FetchState = PendingState | ErrorState | SuccessState;

/** A function that is called with the current fetch state. */
export type FetchStateListener = (state: FetchState) => void;

/** A function that aborts the fetch request.*/
export type AbortFetch = () => void;

/** The initial state of the fetch request.*/
export const pendingState = {
  data: undefined,
  error: null,
  isError: false,
  isLoading: true,
} as const satisfies PendingState;

const createErrorState = (error: Error) =>
  ({
    data: undefined,
    error,
    isError: true,
    isLoading: false,
  }) as const satisfies ErrorState;

const createSuccessState = (data: string) =>
  ({
    data,
    error: null,
    isError: false,
    isLoading: false,
  }) as const satisfies SuccessState;

export function fetchRemoteData(
  url: string,
  listener: FetchStateListener,
): AbortFetch {
  const controller = new AbortController();
  const { signal } = controller;

  void fetch(url, { signal })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response.text();
    })
    .then((data) => {
      if (signal.aborted) return;
      const newState = createSuccessState(data);
      listener(newState);
    })
    .catch((err) => {
      if (signal.aborted) return;
      const error = ensureError(err);
      const newState = createErrorState(error);
      listener(newState);
    });

  return () => {
    controller.abort();
  };
}
