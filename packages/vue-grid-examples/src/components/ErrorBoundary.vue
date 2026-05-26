<script setup lang="ts">
import { exampleErrorMessageStyles } from "@jsoc/grid-examples-shared";
import { ensureError } from "@jsoc/utils";
import { computed, onErrorCaptured, ref, watch } from "vue";

const props = defineProps<{
  resetKeys?: unknown[];
}>();

const error = ref<Error | null>(null);

onErrorCaptured((captured) => {
  error.value = ensureError(captured);
  return false;
});

const slotKey = computed(() =>
  props.resetKeys != null ? JSON.stringify(props.resetKeys) : 0,
);

watch(
  () => props.resetKeys,
  () => {
    error.value = null;
  },
);
</script>

<template>
  <div v-if="error" :style="exampleErrorMessageStyles.container">
    <p :style="exampleErrorMessageStyles.title">
      {{ error.name }}
    </p>
    <div :style="exampleErrorMessageStyles.message">
      <pre :style="exampleErrorMessageStyles.messagePre">{{
        error.message
      }}</pre>
    </div>
  </div>
  <template v-else :key="slotKey">
    <slot />
  </template>
</template>
