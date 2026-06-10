<script setup lang="ts">
import ExamplesRouterIndexPage from "#router/ExamplesRouterIndexPage.vue";
import type { ExamplesRouterOptions } from "#router/types.ts";
import { useExampleIdSearchParam } from "#router/useExampleIdSearchParam.ts";

import { isValidExampleId } from "@jsoc/grid-docs";

import { computed } from "vue";

const props = defineProps<ExamplesRouterOptions>();

const { exampleId } = useExampleIdSearchParam();

const activeComponent = computed(() => {
  const exampleIdValue = exampleId.value;
  if (
    !exampleIdValue ||
    !isValidExampleId("vue-grid", props.pluginId, exampleIdValue)
  ) {
    return null;
  }

  return props.components[exampleIdValue];
});
</script>

<template>
  <template v-if="activeComponent">
    <component :is="activeComponent" />
  </template>

  <p v-else-if="exampleId">Invalid example ID: "{{ exampleId }}"</p>

  <ExamplesRouterIndexPage v-else :plugin-id="props.pluginId" />
</template>
