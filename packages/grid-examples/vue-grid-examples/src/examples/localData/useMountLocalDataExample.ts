import { useGetLocalData } from "#examples/localData/useLocalData.ts";

import { ref, watch } from "vue";

export type LocalDataExampleRender = (data: string) => void;

/**
 * Subscribes to local broadcast data and invokes `render` when data is available.
 */
export function useMountLocalDataExample(render: LocalDataExampleRender) {
  const data = useGetLocalData();
  const error = ref<unknown>();

  watch(
    data,
    (value) => {
      error.value = undefined;
      if (!value) return;

      try {
        render(value);
      } catch (caught) {
        error.value = caught;
      }
    },
    { flush: "sync", immediate: true },
  );

  return { data, error };
}
