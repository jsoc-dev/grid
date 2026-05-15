import { REMOTE_DATA_EXAMPLE_URL } from "@jsoc/grid-docs";
import {
  fetchRemoteJSONText,
  toFetchRemoteJSONError,
} from "@jsoc/grid-examples-shared";
import { ref, watch } from "vue";

export const useGetRemoteJSON = (url: string = REMOTE_DATA_EXAMPLE_URL) => {
  const data = ref<string | null>(null);
  const loading = ref(true);
  const error = ref<Error | false | null>(null);

  watch(
    () => url,
    (_url, _prev, onCleanup) => {
      const controller = new AbortController();
      onCleanup(() => {
        controller.abort();
      });

      loading.value = true;
      error.value = null;
      data.value = null;

      fetchRemoteJSONText(url, controller.signal)
        .then((str) => {
          data.value = str;
          error.value = false;
        })
        .catch((maybeError) => {
          if (controller.signal.aborted) return;
          error.value = toFetchRemoteJSONError(maybeError);
        })
        .finally(() => {
          if (!controller.signal.aborted) {
            loading.value = false;
          }
        });
    },
    { immediate: true },
  );

  return { data, loading, error };
};
