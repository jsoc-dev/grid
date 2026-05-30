<script setup lang="ts">
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
  <div v-if="error" class="error">
    <p>{{ error.name }}</p>
    <div>
      <pre>{{ error.message }}</pre>
    </div>
  </div>
  <template v-else :key="slotKey">
    <slot />
  </template>
</template>
