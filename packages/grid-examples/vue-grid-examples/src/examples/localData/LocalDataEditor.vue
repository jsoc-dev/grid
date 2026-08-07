<script setup lang="ts">
import {
  useGetLocalData,
  useSetLocalData,
} from "#examples/localData/useLocalData.ts";

import "@jsoc/grid-examples-core/css/local-data-editor.css";
import { ref } from "vue";

const isOpen = ref(false);
const localData = useGetLocalData();
const draft = ref(localData.value);

useSetLocalData(draft);
</script>

<template>
  <div class="local-data-editor">
    <textarea
      v-if="isOpen"
      class="local-data-editor__textarea"
      aria-label="Local JSON data"
      placeholder="Enter JSON"
      spellcheck="false"
      :value="draft ?? ''"
      @input="
        draft = ($event.target as HTMLTextAreaElement).value;
      "
    />
    <button
      type="button"
      class="local-data-editor__toggle"
      :class="
        isOpen
          ? 'local-data-editor__toggle--close'
          : 'local-data-editor__toggle--edit'
      "
      :aria-label="isOpen ? 'Close JSON editor' : 'Edit local JSON data'"
      @click="isOpen = !isOpen"
    />
  </div>
</template>
