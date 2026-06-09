import {
  readExampleIdSearchParam,
  setExampleIdSearchParam,
  subscribeLocationChange,
} from "@jsoc/grid-examples-shared";
import { computed, onScopeDispose, ref } from "vue";

const exampleId = ref(readExampleIdSearchParam());

/**
 * Reads and updates `exampleId` from `window.location.search`, matching react-grid examples.
 */
export function useExampleIdSearchParam() {
  const unsubscribe = subscribeLocationChange(() => {
    exampleId.value = readExampleIdSearchParam();
  });

  onScopeDispose(unsubscribe);

  return {
    exampleId: computed(() => exampleId.value),
    setExampleId: setExampleIdSearchParam,
  };
}
