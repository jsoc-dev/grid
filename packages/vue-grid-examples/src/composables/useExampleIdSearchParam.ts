import { EXAMPLE_ID_SEARCH_PARAM } from "@jsoc/grid-docs";
import { computed, onMounted, onUnmounted, ref } from "vue";

function readExampleId(): string | undefined {
  return (
    new URLSearchParams(window.location.search).get(EXAMPLE_ID_SEARCH_PARAM) ??
    undefined
  );
}

/**
 * Reads and updates `exampleId` from `window.location.search`, matching react-grid examples.
 */
export function useExampleIdSearchParam() {
  const exampleId = ref(readExampleId());

  const sync = () => {
    exampleId.value = readExampleId();
  };

  onMounted(() => {
    window.addEventListener("popstate", sync);
  });

  onUnmounted(() => {
    window.removeEventListener("popstate", sync);
  });

  function setExampleId(id: string) {
    const url = new URL(window.location.href);
    url.searchParams.set(EXAMPLE_ID_SEARCH_PARAM, id);
    history.pushState(null, "", url);
    exampleId.value = id;
  }

  return {
    exampleId: computed(() => exampleId.value),
    setExampleId,
  };
}
