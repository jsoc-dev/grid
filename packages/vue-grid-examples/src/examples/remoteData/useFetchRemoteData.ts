import {
  fetchRemoteData,
  type FetchState,
  pendingState,
  REMOTE_DATA_EXAMPLE_URL,
} from "@jsoc/grid-examples-shared";
import { onScopeDispose, type ShallowRef, shallowRef, watch } from "vue";

/**
 * Fetches data from the given URL and returns reactive fetch state.
 * If `url` is not provided, it defaults to {@link REMOTE_DATA_EXAMPLE_URL}.
 */
export function useFetchRemoteData(
  url: string = REMOTE_DATA_EXAMPLE_URL,
): ShallowRef<FetchState> {
  const state = shallowRef<FetchState>(pendingState);

  const stop = watch(
    () => url,
    (_url, _prev, onCleanup) => {
      const abort = fetchRemoteData(url, (newState) => {
        state.value = newState;
      });

      onCleanup(abort);
    },
    { immediate: true },
  );

  onScopeDispose(stop);

  return state;
}
