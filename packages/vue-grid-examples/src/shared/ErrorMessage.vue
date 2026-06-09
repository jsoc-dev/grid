<script setup lang="ts">
import "@jsoc/grid-examples-shared/css/error-message.css";

import { ensureError } from "@jsoc/utils";
import { computed } from "vue";

const props = defineProps<{
  error: unknown;
}>();

const err = computed(() => ensureError(props.error));
</script>

<template>
  <div class="error-message">
    <p>{{ err.name }}</p>
    <div>
      <pre>{{ err.message }}</pre>
    </div>
  </div>
</template>
